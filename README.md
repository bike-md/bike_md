# Bike MD
## Live site [HERE](bike-md.herokuapp.com)
Bike MD is a community of motorcycle technicians, a place where they can connect with each other and ask technical questions, browse common problems and solutions by model, and help each other troubleshoot vehicles more efficiently. This website was originally built as my final project for the Iron Yard. It was developed with Python, Django, JavaScript, Sass, Ajax, and PostgreSQL etc...Recently I have started making a list of improvements and bugs that need to be addressed. This is now an open source project and all contributors are welcome! We're in the process of creating documentation, wiki guides, commenting existing code, and creating other support materials so check back soon for more details on how to get involved.

# Local Build:
1. clone the repo
`git clone https://github.com/bike-md/bike_md.git`

2. create a virtualenv, I prefer this because it eliminates a lot of package install issues
`echo layout python3 > .envrc`
4. Install packages
`pip install -r requirements.txt`
5. Set up postgreSQL if you don't have it already. Install guide [here](http://postgresguide.com/)
   a. Set up a database called BIKEMD, I recommend using Potico to manage postgreSQL DBs.
6. Configure your settings_example.py file if needed.
   a. Remove the word 'example', making the new title settings.py. This will be your local settings file and will be ignored when you push.
   Note: IF you used the DB name recommended above there shouldn't be anything to configure.
7. Run migrations
`python manage.py migrate`
8. Create super user
`python manage.py createsuperuser`
9. Thats it! you can now run a local copy of the site
`python manage.py runserver`

# TODO List:
### 1. finish profile page.
### 2. finish notifications.
### 3. refactor JavaScript to remove repetitive functions and on clicks etc...
### 4. refactor and clean up CSS.
### 5. make a better todo list.
## many more to come
