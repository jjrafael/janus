# Janus
Creating a plain out-of-the-box ReactJS stack from previous works

## App

### Running in development mode
1. In terminal, run ```npm start```
2. The default env will be ```dev``` which points to ```https://mswlar.lotus.local:8443/abp/```
3. To point to another proxy url, run ```npm start -- --env={env}```
4. For example, run ```npm start -- env=test``` to run against Test environment
5. There are 3 different environments: ```dev```, ```dev2```, and ```test```
6. ```dev2``` is pointed to ```https://msw.lotus.local:8443/abp/```
7. ```test``` is pointed to ```https://mswtest.lotus.local:8443/abp/```
8. To point to a custom proxy url, run ```npm start -- --url={url}```
9. For example, run ```npm start -- --url=https://192.168.1.100:8080/```

## Stylesheets
### Adding new/custom icons using icomoon app
(https://icomoon.io/app/#/select)

**NOTE: Do this only in develop branch**

1. Go to https://icomoon.io/app/#/select and click on **Import Icons** button to import our existing icon selections.

2. Select ```selection.json``` from ```src/stylesheets/phxicons``` folder.

3. Click **Yes** on the "Your icon selection was loaded.
Would you like to load all the settings stored in your selection file?" dialog.

4. Once uploaded, add new icon/icons to the list of selections.

5. Click **Generate Font** and then **Download Font**

6. Once downloaded, open ```style.css``` and remove the ```@font-face``` declaration.

7. Replace the ```fonts```, ```selection.json``` and ```style.css``` in src/stylesheets/phxicons folder 

