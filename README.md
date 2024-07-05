# u12.js

u12.js is the official u12.org CLI, designed to facilitate various network-related tasks. This README provides a comprehensive guide for beginners to get started with u12.js, from prerequisites to usage instructions.

## Prerequisites

Before you can use u12.js, ensure you have the following installed on your system:

- Node.js
- npm (Node Package Manager)
- make

## How-to

To get started with u12.js, follow these steps:

### 1. Clone the Repository

First, clone the u12.js repository to your local machine:

```bash
git clone https://github.com/duncap/u12js.git
```
### 2. Navigate to the Cloned Repository
Move into the cloned repository directory:

```bash
cd u12js
```
### 3. Run makefile
Run makefile to auto-compile all processes.

```bash
make
```

### 4. Test
You should now be able to run u12.js in your terminal. To check, run:

```bash
u12.js
```
## Fields
When running u12.js, you need to provide three fields:

- Domain
- Offer
- Path to File

### 1. Domain
The domain represents the network you are targeting. An official list of all verified networks is included in this repository. To view the list of networks, execute:

```bash
cat networks.txt
```
### 2. Offer
The offer is a brief description of what you are submitting. It could be anything from a zero-day exploit to a funny image. Ensure the description is short and concise.

### 3. Path to File
Provide the path to your file relative to the cloned repository directory. This file is what you are submitting as your offer.

### Example Usage
With all fields filled out, you can submit your offer like this:

```bash
u12.js <domain> <offer> <path-to-file>
```
Replace <domain>, <offer>, and <path-to-file> with your selected network's domain, offer description, and file path.

Additional Information
For further information or troubleshooting, refer to the documentation within the repository or contact me at spamska@u12.org.
