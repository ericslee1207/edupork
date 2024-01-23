from django.contrib import admin
from django.urls import path
from django.urls import path, re_path, include
from django.views.generic import TemplateView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('edufy/', include('edupork.urls')),
    path('admin/', admin.site.urls),
]

# urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
