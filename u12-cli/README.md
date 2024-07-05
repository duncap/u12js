# u12.js

u12.js is the official u12.org CLI.

## Prerequisites
Node and NPM

## How-to

To start, clone this repo.

```bash
git clone https://github.com/duncap/u12js.git
```

After forking, navigate to the clone and grant u12.js executability.
```bash
cd u12js
chmod +x u12.js
```

If all done right, executing u12.js should output the following.

```bash
./u12.js
Usage: ./u12.js <domain> <offer> <path-to-file>
```

## Fields

The first field is the domain, an official list of all verified networks is inside of this repo. Execute the following to view.

```bash
cat networks.txt
```

Next is the offer, could describe anything. From a zero-day exploit to a funny image. Must be short and sweet though.

Finally we have the path to file. Privude the path to your file from the viewpoint of the clone folder.

With all fields, our offer can be submitted.
