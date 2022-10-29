
from django.contrib import admin
from django.urls import path, include

from profiling.views import LoginAuthView, ListView

urlpatterns = [
    # path('admin/', admin.site.urls),
    # path('api-auth/', include('rest_framework.urls')),
    # path('profile/', include('profiling.urls')),
    path('token/', LoginAuthView.as_view(), name='token_obtain_pair'),
    path('list/', ListView.as_view(), name='list values'),
]
