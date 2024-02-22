from django.core.management import call_command
import os
def superuser(event, context):
    email = os.getenv('SUPERUSER_EMAIL')
    password = os.getenv('SUPERUSER_PASSWORD')
    
    if email and password:
        call_command('createsuperuser', interactive=False, email=email, password=password)
        return {
            'statusCode': 200,
            'body': 'Superuser created successfully'
        }
    else:
        return {
            'statusCode': 500,
            'body': 'Error: SUPERUSER_EMAIL or SUPERUSER_PASSWORD environment variables are not set.'
        }

def main():
    superuser()
if __name__ == '__main__':
    main()
