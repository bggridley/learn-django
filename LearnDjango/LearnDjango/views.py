from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers.json import DjangoJSONEncoder

import json
from .models import Person

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