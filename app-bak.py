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
 'umap_V1',
 'umap_V2',
 'umap_V3',
 'umap_V4',
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








@app.route('/')
@app.route('/word')
@app.route('/word/<word>')
def analyze_word(word=DEFAULT_WORD,subpage="all"):
    #return template_path
    return render_template('word.html',word=word,subpage=subpage,vecs=VECS)

@app.route('/spaces/<word>')
def analyze_word_spaces(word=DEFAULT_WORD,subpage="spaces"):
    #return template_path
    return render_template('word.html',word=word,subpage=subpage,vecs=VECS)


@app.route('/custom/<word>')
def analyze_word_custom(word=DEFAULT_WORD,subpage="custom",vec1=None,vec2=None):
    #return template_path/
    fields = [fn[:-5] for fn in os.listdir(field_dir) if fn.endswith('.json')]
    print('!?',fields)

    import random
    vec1=random.choice(VECS)
    vec2=random.choice(VECS)

    return render_template('word.html',word=word,subpage=subpage,fields=fields,vecs=VECS,vec1=vec1,vec2=vec2)


@app.route('/ranks/<word>')
def analyze_word_ranks(word=DEFAULT_WORD):
    #return template_path
    return render_template('word.html',word=word,subpage="ranks",vecs=VECS)



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
