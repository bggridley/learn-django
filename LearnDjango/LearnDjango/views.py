from django.views import View
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import PersonSerializer
from .models import Person
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login


@api_view(['POST'])
def submitLogin(req):
    user = req.data['username']
    password = req.data['password']
    usr = authenticate(username=user, password=password)
    if usr is not None:
        login(req, usr)
        return Response({'message': 'authenticated'})
    else:
        return Response({'message': 'failed to authenticate'})

@api_view(['GET', 'POST', 'DELETE'])
def person(req):
    if (req.method == 'GET'):
        people = Person.objects.all()
        serializer = PersonSerializer(people, many=True)
        return Response(serializer.data)
    elif (req.method == 'POST'):

        if (req.data['firstname'].strip() != '' and req.data['lastname'].strip() != ''):
            fn = req.data['firstname']
            ln = req.data['lastname']
            person = Person.objects.create(firstname=fn, lastname=ln)
            serializer = PersonSerializer(instance=person)
            return Response(serializer.data)
        else:
            return Response({'message': 'Firstname and lastname cannot be empty or whitespace'})
    elif (req.method == 'DELETE'):
        Person.objects.filter(pk=req.query_params.get('pk')).delete()
        value = req.query_params.get('pk')
        return Response(value)


"""
@csrf_exempt # temporary until auth is done
def person(req):
    if(req.method == 'GET'):
        data = serialize('json', Person.objects.all(), fields=["firstname", "lastname"]) #specify which fields are needed to be returned
        return HttpResponse(data, content_type='application/json')
    elif (req.method == 'POST'):
        data = json.loads(req.body)
        fn = data.get('firstname')
        ln = data.get('lastname')

        person = Person.objects.create(firstname=fn, lastname=ln)
        serialized_data = serialize('json', [person])
        return HttpResponse(serialized_data, content_type='application/json')
        #Person.objects.create(firstname="Ben", lastname="Gridley")
    elif (req.method == 'DELETE'):
        Person.objects.filter(pk=req.GET.get('pk', '')).delete()
        return HttpResponse('Deleted successfully')
"""
