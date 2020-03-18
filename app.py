import os

DEFAULT_WORD = "data,work,culture"

from flask import Flask, request, render_template, redirect, url_for

project_root = os.path.dirname(os.path.realpath('__file__'))
template_path = os.path.join(project_root, 'templates')
static_path = os.path.join(project_root, 'static')
app = Flask(__name__, template_folder=template_path, static_folder=static_path)


field_dir = os.path.join(static_path,'data','db','fields')
print(field_dir)



VECS =  [
 # 'umap_V1',
 # 'umap_V2',
 # 'umap_V3',
 # 'umap_V4',
 'Animal (VG2) <> Human (VG2)',
 'Black <> White',
 'Concrete (CHPoetry-All) <> Abstract (CHPoetry-All)',
 'Concrete (CHPoetry-Robust) <> Abstract (CHPoetry-Robust)',
 'Concrete (Consolidated) <> Abstract (Consolidated)',
 'Concrete (ConsolidatedBinary) <> Abstract (ConsolidatedBinary)',
 'Concrete (HGI) <> Abstract (HGI)',
 'Derogatory (VG2) <> Non-Derogatory (VG2)]',
 'Female (HGI) <> Male (HGI)',
 'Female (VG2) <> Male (VG2)',
 'Hard Seed (RH&LL) <> Abstract Values (RH&LL)',
 'Negative (Abs-Cluster) <> Positive (Abs-Cluster)',
 'Negative (HGI) <> Positive (HGI)',
 'Object (VG2) <> Animal (VG2)',
 'Object (VG2) <> Animal+Human (VG2)',
 'Object (VG2) <> Human (VG2)',
 'Object (WN) <> Human (WN)',
 'Objective (Abs-Cluster) <> Subjective (Abs-Cluster)',
 'Passive (HGI) <> Active (HGI)',
 'Poetic Diction (CHPoetry) <> Prosaic Diction (CHPoetry)',
 'Pre-Norman (TU&JS) <> Post-Norman (TU&JS)',
 'Racialized (VG2) <> Non-Racialized (VG2)',
 'Science (Abs-Cluster)',
 'Submit (HGI) <> Power (HGI)',
 'Substance (Locke) <> Mode (Locke)',
 'Tangible (MT) <> Intangible (MT)',
 'The Natural (Abs-Cluster) <> The Social (Abs-Cluster)',
 'Vice (HGI) <> Virtue (HGI)',
 'Weak (HGI) <> Strong (HGI)',
 'Woman <> Man',
 # 'model_count',
 # 'model_rank',
 # 'rank',
 # 'vec_avg_abstractness',
 # 'vec_avg_animacy',
 # 'vec_avg_gender',
 # 'vec_avg_judgment',
 # 'vec_avg_metaphysics',
 # 'vec_avg_passive_active',
 # 'vec_avg_race',
 # 'vec_avg_science',
 # 'vec_avg_society',
 # 'vec_avg_style',
 # 'vec_avg_word_origin',
 # 'date',

 # 'period'
 ]

def get_fields():
    return [fn[:-5] for fn in os.listdir(field_dir) if fn.endswith('.json')]


GLOBAL_OPTS = {'fields':get_fields(), 'vecs':VECS, 'x_vec':'umap_V3', 'y_vec':'umap_V4'}
GLOBAL_OPTS['all_fields_vecs'] = sorted(list(set(GLOBAL_OPTS['fields'] + GLOBAL_OPTS['vecs'])))

GLOBAL_OPTS['points']='movement'
GLOBAL_OPTS['view']='spaces'
GLOBAL_OPTS['x_vec_str']='King - Man + Woman'
GLOBAL_OPTS['y_vec_str']='Young - Old'



@app.route('/')
@app.route('/word')
@app.route('/word/<word>')
def analyze_word(word=DEFAULT_WORD,**opts):
    OPTS = dict(list(opts.items()) + list(request.args.items()))
    return render_template('word.html',WORD=word, OPTS=OPTS, GLOBAL_OPTS=GLOBAL_OPTS)

@app.route('/spaces/<word>')
def analyze_word_spaces(word=DEFAULT_WORD):
    return analyze_word(word,view="spaces")


@app.route('/custom/<word>')
def analyze_word_custom(word=DEFAULT_WORD):
    return analyze_word(word,view="custom",x_vec_str="man",y_vec_str="woman")


@app.route('/ranks/<word>')
def analyze_word_ranks(word=DEFAULT_WORD):
    return analyze_word(word,view="ranks")



@app.route('/about')
def index():
	return render_template('about.html')

@app.route('/corpus_coha')
def corpus_coha():
	return render_template('corpus_coha.html')

@app.route('/manifestos')
def manifestos():
    return render_template('manifestos.html')

@app.route('/manifestos_feb22')
def manifestos_feb22():
    return render_template('manifestos_feb22.html')



if __name__ == '__main__':
    app.run(debug=True)
