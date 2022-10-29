from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests


# Create your views here.
from profiling.models import UserProfile
from profiling.serializers import UserSerializer, UserProfileSerializer


class LoginAuthView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, request, format=None):
        source = request.data.get('source')
        token = request.data.get('token')
        email = request.data.get('email')
        lat = request.data.get('lat')
        lng = request.data.get('lng')
        valid = False

        if source == 'fb':
            valid = self.validate_facebook_token(token)
        elif source == 'google':
            valid = self.validate_gmail_token(token)
        elif source == 'twitter':
            valid = self.validate_twitter_token(token)

        if valid:
            user, created = User.objects.get_or_create(
                email = email,
                username = email,
            )
            if created:
                userProfile = UserProfile.objects.create(
                    user=user,
                    lat=lat,
                    lng=lng,
                    source=source
                )
            else:
                userProfile = UserProfile.objects.get(
                    user=user
                )
                if userProfile.source != source:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data={
                        "error" : "User already registered with another source"
                    })
            refresh = RefreshToken.for_user(user)

            return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
                'email' : user.email,
                'user': UserProfileSerializer(userProfile).data
            })
        return Response(status=status.HTTP_400_BAD_REQUEST, data={
            "error": "Token sent is not valid"
        })

    def validate_facebook_token(self, token):
        # graph.facebook.com / debug_token?
        # input_token = {token - to - inspect}
        # & access_token = {app_id} | {app_secret}
        return True

    def validate_gmail_token(self, token):
        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), '644475778543-lnlrnugfqs13qh15e33qhdkbo18ksmng.apps.googleusercontent.com')
            userid = idinfo['sub']
            return True
        except ValueError:
            return True

    def validate_twitter_token(self, token):
        # graph.facebook.com / debug_token?
        # input_token = {token - to - inspect}
        # & access_token = {app_id} | {app_secret}
        return True


class ListView(APIView):

    def get(self, request, format=None):

        user = request.user
        userProfile = UserProfile.objects.get(user=user)
        data = []
        if userProfile.source == 'fb':
            all_users = UserProfile.objects.filter(source='google')
            data = UserProfileSerializer(all_users, many=True).data

        return Response(
            data
        )
