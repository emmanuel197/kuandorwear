from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class UserManagerTests(TestCase):
    def test_create_user_sets_fields_and_password(self):
        user = User.objects.create_user(
            email="Driver@Example.COM", username="driver1",
            first_name="Ama", last_name="Mensah", password="s3cretpass",
        )
        self.assertEqual(user.email, "Driver@example.com")  # domain normalized
        self.assertTrue(user.check_password("s3cretpass"))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_admin)
        self.assertFalse(user.is_staff)

    def test_create_user_without_email_raises(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", username="nobody", password="x")

    def test_create_superuser_sets_admin_flags(self):
        admin = User.objects.create_superuser(
            email="boss@example.com", username="boss", password="adminpass",
        )
        self.assertTrue(admin.is_admin)
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    def test_str_returns_email(self):
        user = User.objects.create_user(
            email="x@example.com", username="x1", password="p",
        )
        self.assertEqual(str(user), "x@example.com")
