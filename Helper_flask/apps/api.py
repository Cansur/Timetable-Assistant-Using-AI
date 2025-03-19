from flask import Blueprint, jsonify, request

api = Blueprint('api', __name__)

@api.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, API!"})

@api.route('/echo', methods=['POST'])
def echo():
    data = request.json
    return jsonify({"received": data})