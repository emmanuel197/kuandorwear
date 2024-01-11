from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, name=None):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), username=username, name=name)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, password=None, name=None):
        user = self.create_user(email, username, password=password, name=name)
        user.is_admin = True
        user.is_superuser = True
        user.save()
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    username = models.CharField(max_length=30, unique=True, default="JohnDoe123")
    name = models.CharField(max_length=100, default='John Doe')
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']


    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        # print(f"User Permissions: {self.get_all_permissions()}")
        
        # Check if the user has the required permission to view a custom user
        required_permission = "accounts.view_customuser"
        return self.is_active or self.user_permissions.filter(codename=required_permission).exists()

    @property
    def is_superuser(self):
        return self.is_admin

    @is_superuser.setter
    def is_superuser(self, value):
        self.is_admin = value

    @property
    def is_staff(self):
        return self.is_admin
