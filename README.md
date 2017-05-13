# Bike MD 1.0
#### See the live site [HERE](bike-md.herokuapp.com)
Bike MD is a community of motorcycle technicians and  motorcycle owners, a place where they can connect with each other and ask technical questions, browse common problems and solutions by model, and help each other troubleshoot bikes more efficiently. This website was originally built as my final project for the Iron Yard. It was developed with Python, Django, JavaScript, Sass, Ajax, and PostgreSQL etc...Recently I have started making a list of improvements and bugs that need to be addressed. This is now an open source project and all contributors are welcome! We're in the process of creating documentation, wiki guides, commenting existing code, and creating other support materials so check back soon for more details on how to get involved.
Please contact me with any questions regarding the TODO list as I will happily give you more details.

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


## TODO List:
## Large items:
#### 1. Build profile page.
#### 2. Finish notifications: add to drop down, send emails.
#### 3. Refactor JavaScript to remove repetitive functions and on clicks etc...
#### 4. Refactor and clean up CSS.
#### 5. Make site responsive.


## Smaller problems/bugs:
#### 1. Show bike details on problem detail view.
#### 2. Make password fail message a popup that auto closes after a few seconds.
#### 4. Error checking feed back to user when operations fail. This is needed everywhere.
#### 5. If problem list has no content to display a message to that extent instead of failing.
#### 6. Tell user if problem post fails and why.
#### 7. Fix user creation: Either combine tech and user into one object or make the simultaneous
#### object creations work correctly.
#### 8. Remove login requirement for all pages. Account creation will now only be required
#### for Posting problems, solutions, and comments.
#### 9. Implement the commit module, create ability to comment on solutions.
#### 10. Problem list header: move out of Handlebars script so it always loads instead of only when there's data.
#### 11. Bike details page: only load system modal if there are problems posted for that system.
#### 12. Sort solutions on problem detail pages by date, rating etc.
*Many more items to come*
