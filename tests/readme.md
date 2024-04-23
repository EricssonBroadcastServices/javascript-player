<!--
SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# End-2-End tests

The e2e tests are designed to be run locally on developer machines before a release is made or if the developer suspects that something might break.
The goal is to make sure that we cover every normal and custom cases that we have.

## Tests
The test cases are defined NOT as tests but as functions in the `cases/` folder. That way they are generic and any number of testables (assets) can access them if needed.

Under `customers/` a folder is created per CU/BU that needs to have tests, this is where actual `.test.ts` files are defined.

The basic tests are defined under `customers/Players_SDKTesting` where we want most asset types to exist.
We've defined a set of generic test cases that are run for each asset type ( see `config.ts` for the customer )

## Customers
To add a new customer simply create a folder with the customer & businessUnit name and create a `config.ts` that contains the necessary
information to run tests. Please note that for production customers we CANNOT use hardcoded username & passwords, if you add a production customer please
make sure to add username/password as env variables instead.