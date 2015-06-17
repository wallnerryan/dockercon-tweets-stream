FROM    centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y npm

# Install app dependencies
RUN npm install mongodb
RUN npm install twitter

# Bundle app source
COPY ./src /src
COPY ./src/package.json /src/package.json
COPY ./src/stream.js /src/stream.js
WORKDIR /src 
RUN npm install -d

CMD ["node", "/src/stream.js"]
