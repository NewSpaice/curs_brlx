from django.conf import settings
from django.conf.urls.static import static
from products.views import PromotionViewSet

urlpatterns = [
    # ... существующие urls ...
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

router.register(r'promotions', PromotionViewSet) 