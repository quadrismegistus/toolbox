from flask import render_template, flash, redirect, request, session, g
from flask_socketio import emit
from app import app,socketio
from .forms import LoginForm
from webprosodic import WebText,json2meter,get_meter,check_constraint,default_meter
import time

import gevent
from gevent import monkey, sleep
monkey.patch_all()

### FUNCTIONS

def check_session(session):
	if not 'meter' in session or not session['meter']:
		session['meter']=default_meter()

def web_check_constraint(constraint,type):
	if not 'meter' in session: return '1' if type=='weight' else ''
	return check_constraint(session['meter'],constraint,type)

def now(now=None):
	import datetime as dt
	if not now:
		now=dt.datetime.now()
	elif type(now) in [int,float,str]:
		now=dt.datetime.fromtimestamp(now)

	return '{0}-{1}-{2}.{3}:{4}:{5}'.format(now.year,str(now.month).zfill(2),str(now.day).zfill(2),str(now.hour).zfill(2),str(now.minute).zfill(2),str(now.second).zfill(2))


app.jinja_env.globals.update(check_constraint=web_check_constraint)

### INDEX PAGE


@app.before_request
def before_request():
	print '>> new request @ %s coming from %s' % (now(), request.remote_addr)
	check_session(session)
	#print session['meter']
	# print '-----'
	#print

@app.route('/about')
def index():
	return render_template('about.html')



### PAGES
@app.route('/')
@app.route('/parse')
def parse():
	return render_template('parse3.html')

### PARSING
@app.route('/meter')
def meter():
	return render_template('meter_form2.html')

@app.route('/meter',methods=['POST'])
def meter_post():
	print request.form['csrf_token']
	print request.form.items()
	return render_template('meter_form2.html')



#### SOCKETS
@socketio.on('parse_meter_form')
def parse_meter_form(msg):
	meter_config=json2meter(msg['data'])
	print '>> updating meter to:',meter_config
	session['meter']=meter_config
	print session.items()

@socketio.on('remove_constraint')
def remove_constraint(msg):
	constraint=msg['data']
	print '>> removing constraint:',constraint
	if not 'meter' in session: return
	meter_config = session['meter']
	if constraint in meter_config['constraints']: meter_config['constraints'].remove(constraint)
	session['meter'] = meter_config



@socketio.on('parse_text')
def parse_text(data,meter='meter_arto',row_buffer=1,cache_result=True):
	text=data['data']
	#print 'received message: "%s"' % text

	print session.items()

	t = WebText(text)
	t.meter = get_meter(session)
	print t.meter
	columns=t.meter2columns()
	columns_data = [{'title':col} for col in columns]
	if cache_result: session['parsed_rows']=[]

	emit('parse_text_response', {'columns':columns_data})
	rows=[]
	num_lines=float(len(t.lines()))
	for i,dx in enumerate(t.iparse_rows()):
		if cache_result: session['parsed_rows']+=[dx]
		row = [dx.get(col,'') for col in columns]
		rows_all_parses = [ [ dx.get(col,'') for col in columns] for dx in dx['all_parses']]
		emit('parse_text_addrow',{'row':row, 'progress':(i+1)/num_lines, 'rows_allparses':rows_all_parses, 'line_id':i+1})
		sleep(0.0000001)


@socketio.on('save_text_stats')
def stats_text(data):
	print session['parsed_rows'][0]
###
