import os

from flask import Flask, request, render_template, redirect, url_for

project_root = os.path.dirname(os.path.realpath('__file__'))
template_path = os.path.join(project_root, 'templates')
static_path = os.path.join(project_root, 'static')
app = Flask(__name__, template_folder=template_path, static_folder=static_path)

@app.route('/')
@app.route('/word')
@app.route('/word/<word>')
def analyze_word(word=None):
    return template_path
    #return render_template('word.html')

if __name__ == '__main__':
    app.run(debug=True)
