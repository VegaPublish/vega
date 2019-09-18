### Vega Install Guide

The platform which Vega is built on is called lyra. To start, install the lyra command line interface:

```
npm install -g @lyra/cli
```

Before creating your project you must change two values in the `/usr/bin/lyra` file to make the install work. Search for “example-venue” and change the two references to “example-journal”.

Then, run the setup wizard with:

```
lyra init
```

You will be prompted to set the following values:

```
Name of your project: yourproject
Backend API Host: http://yourIPorFQDN:4000
Name of default venue (as configured in the backend): yourproject
Name of dataset for default venue: yourproject
```

`Output path: /root/yourproject` (you can choose to keep the default by hitting enter)

`Select project template Example venue (with sample plugins)` 

When completed, you have a project folder with a new Vega instance. Change directories to that folder and run `lyra start`. Then open your browser and point it to the URL prompted to you in the terminal.

You should see something like this once Lyra has started:

```
root@vega:/vega# lyra start
✔ Checking configuration files...
⠧ Compiling...webpack built baa56a497c2a472473fc in 17836ms
✔ Compiling...
Content Studio successfully compiled! Go to http://yourdomain.com:3333