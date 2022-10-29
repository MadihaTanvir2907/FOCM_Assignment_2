from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class UserProfile(models.Model):
    user = models.ForeignKey(User, unique=True, on_delete=models.CASCADE)
    lat = models.CharField(max_length=140)
    lng = models.CharField(max_length=140)
    source = models.CharField(max_length=140)

    def __unicode__(self):
        return u'Profile of user: %s' % self.user.username