# Bike MD 1.0
#### See the live site [HERE](http://bike-md.herokuapp.com)
Bike MD is a community based site for motorcycle technicians and owners, a place where they can connect with each other and ask technical questions, browse common problems and solutions by model, and help each other troubleshoot bikes more efficiently. This website was originally built as a final project for the Iron Yard. It was developed with Python, Django, JavaScript, and PostgreSQL. The complete refactoring of several files is currently in progress. The goal is to bring the code up to a higher standard and strive to follow best practice guide lines. We're always open to suggestions so if you see something that could be done a better way, and I'm sure that there are a lot of things that could be, please don't hesitate to say so. The list of improvements and bugs that need to be addressed is ever growing. Check back often if nothing catches your eye today. This is an open source project and all contributors of all skill levels are welcome! We're in the process of creating documentation, wiki guides, and commenting existing code to make the project easier to work on and understand. There are a few small issues posted already that are on the easy side and will give you a chance to learn the code base.
Please contact us with any questions regarding contributing to BikeMD!

### Local Build:
1. clone the repo:


`git clone https://github.com/bike-md/bike_md.git`


2. Create a virtualenv, I prefer this because it eliminates a lot of package install issues:


`echo layout python3 > .envrc`


4. Install packages:


`pip install -r requirements.txt`


5. Set up postgreSQL if you don't have it already. Install guide [here](http://postgresguide.com/)


   a. Set up a database called BIKEMD, I recommend using Potico to manage postgreSQL DBs.

6. Configure your settings_example.py file if needed:


   a. Remove the word 'example', making the new title settings.py. This will be your local settings file and will be ignored when you push.
   *Note: IF you used the DB name recommended above there shouldn't be anything to configure.*

7. Run migrations:


`python manage.py migrate`


8. Create super user and tech. For now run the following command 1st.

`python manage.py createsuperuser`

And then create a tech manually using a DB tool. The tech creation method is on the list
of things to do.


9. Thats it! you can now run a fully functional local copy of the site:


`python manage.py runserver`

### Please refer to the wiki's for information on how to contribute.
