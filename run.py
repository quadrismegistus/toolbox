#!bin/python
from app import app,socketio
#app.run(debug=True)
socketio.run(app,host='0.0.0.0',port=5002,debug=True)
