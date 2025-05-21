from flask import Blueprint, Flask, render_template

routes = Blueprint("routes", __name__)

@routes.route('/')
def hello_world():
    return render_template('index.html')

@routes.route('/chat')
def chat_world():
    return render_template('chat.html')

@routes.route('/chat2')
def chat2_world():
    return render_template('chat2.html')

@routes.route('/statistics')
def statistics_world():
    return render_template('statistics.html')

@routes.route('/compare')
def compare_world():
    return render_template('compare.html')

# @routes.route('/layout-static.html')
# def layout_static():
#     return render_template('temp/layout-static.html')

# @routes.route('/layout-sidenav-light.html')
# def layout_sidenav_light():
#     return render_template('temp/layout-sidenav-light.html')

# @routes.route('/login.html')
# def login():
#     return render_template('temp/login.html')

# @routes.route('/register.html')
# def register():
#     return render_template('temp/register.html')

# @routes.route('/tables.html')
# def tables():
#     return render_template('temp/tables.html')

# @routes.route('/charts.html')
# def charts():
#     return render_template('temp/charts.html')

# @routes.route('/404')
# def forgot_password():
#     return render_template('temp/404.html')

@routes.route('/test')
def test():
    return render_template('temp/test.html')