from flask import Blueprint, Flask, render_template

home = Blueprint("home", __name__)

@home.route('/')
def hello_world():
    return render_template('index.html')

@home.route('/layout-static.html')
def layout_static():
    return render_template('layout-static.html')

@home.route('/layout-sidenav-light.html')
def layout_sidenav_light():
    return render_template('layout-sidenav-light.html')

@home.route('/login.html')
def login():
    return render_template('login.html')

@home.route('/register.html')
def register():
    return render_template('register.html')

@home.route('/tables.html')
def tables():
    return render_template('tables.html')

@home.route('/charts.html')
def charts():
    return render_template('charts.html')

@home.route('/404.html')
def forgot_password():
    return render_template('404.html')