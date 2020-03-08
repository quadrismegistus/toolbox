# import os
#
# from flask import Flask, request, render_template, redirect, url_for
#
# project_root = os.path.dirname(os.path.realpath('__file__'))
# template_path = os.path.join(project_root, 'app/templates')
# static_path = os.path.join(project_root, 'app/static')
# app = Flask(__name__, template_folder=template_path, static_folder=static_path)
#
# @app.route('/')
# def index():
#     return 'Hello, World'


from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('my event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']})

@socketio.on('my broadcast event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)

@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app)
