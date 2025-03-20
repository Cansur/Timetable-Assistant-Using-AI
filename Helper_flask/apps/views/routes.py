from flask import Blueprint, Flask, render_template

routes = Blueprint("routes", __name__)

@routes.route('/')
def hello_world():
    return render_template('index.html')

@routes.route('/layout-static.html')
def layout_static():
    return render_template('layout-static.html')

@routes.route('/layout-sidenav-light.html')
def layout_sidenav_light():
    return render_template('layout-sidenav-light.html')

@routes.route('/login.html')
def login():
    return render_template('login.html')

@routes.route('/register.html')
def register():
    return render_template('register.html')

@routes.route('/tables.html')
def tables():
    return render_template('tables.html')

@routes.route('/charts.html')
def charts():
    return render_template('charts.html')

@routes.route('/404.html')
def forgot_password():
    return render_template('404.html')