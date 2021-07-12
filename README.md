# VtigerCRM Basic

This repository contains a basic copy of VtigerCRM, used by Redoo Networks GmbH.  
It should be used as start of any development.  

You can start development with a blank environment, everytime you start a new project.  
Following these steps to do so:
1.  Fork to your personal namespace in Gitlab
2.  Rename the Repository and Path in "Settings" -> "Advanced"
3.  Transfer Project bask to Group "Redoo Developer" or add "Redoo Developers" as Repo Member


## Setup

1.  To install this software, you need to clone/download files on your development server.
2.  Create an empty database with **utf8_general_ci** collection and optionally an own user for CRM to access
3.  Next open **<url>/setup/install.php** in browser and enter database credentials
4.  After you press "Setup" the configuration file is written and you are forwarded to database initialization
5.  Press "Start Import" in frame to initialize the database
6.  After the initialization report "ready", click "Run CRM Initialization", which redirect to another page.  This is default incremental version updater and make sure CRM is working
7.  When page is ready, click "Back to CRM" button on top right and login with admin / admin

## Updates

When you merge external updates, please open /setup/update.php after pull of code
This gives you freedom to also have all database changes, from other developers

## Updates in your module

When your module needs custom database tables or an update require to modify existing tables,  
use a "**MODCheckDB.php**" file within your modules directory. This file is read by CRM Initialization, everytime you, or somebody else, update from GIT.

## Development

You are only developer member of this project. So you need to create your own branch for development.
When the module is ready, you can create a merge request to push code to master.
