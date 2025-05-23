<img width="100%" valign="bottom" src="https://github.com/REI-Systems/REISystems-OGST-USCIS-RAPID-Coding-Challenge-Document-Library/blob/main/assets/bannerUserManagement.png"/>
<br>

The User Management service, will manage users in **AWS Cognito User Pool**. The ci-cd/cdk directory contains the CDK code to create the AWS infrastructure required for this service. The CDK is also utilized to deploy all **Lambda** functions and REST endpoints into the **API Gateway**. 

The Lambda functions are defined in the rest directory. These functions are specific to a REST endpoint. Shared code is found in the <a href="https://github.com/REI-Systems/REISystems-OGST-USCIS-RAPID-Coding-Challenge-User-Management/blob/main/customlayer/nodejs/Utils.mjs">customlayer/nodejs/Utils.mjs</a> file. The CDK will automatically deploy changes to the layers and the Lambda functions. A second layer called layer/nodejs contains third-party packages that can be called by the Lambda. This has a <a href="https://github.com/REI-Systems/REISystems-OGST-USCIS-RAPID-Coding-Challenge-User-Management/blob/main/package.json">package.json</a> file, defining these packages. For local CDK installs - the developer must run ```npm install``` in this directory.

<br>

-----

## GitHub Actions and Workflows

There are are GitHub workflows to create and deploy all AWS resources as well as code required for this feature. These are:

- Deploy DEV RAPID CC User Management
- Deploy STAGE RAPID CC User Management
- Deploy PRODUCTION RAPID CC User Management
- Deploy DEV Swagger RAPID CC
- Deploy STG Swagger RAPID CC

Currently, all of the workflows need to be run manually via the GitHub/Actions option.

The RAPID CC User Management pipeline will create and deploy the serverless resources to support the User Management REST API, the result will be an API gateway with the DNS name: rapidum.`<environment>`.reirapid.net. The production API Gateway is rapidum.reirapid.net.

The Swagger workflows for DEVELOPMENT and STAGING will create an AWS ECS cluster, provising access to the swagger via AWS ALB. The cluster utilizes an AWS Fargate task for provide access to the Java based container. The URLa are:

- DEV: https://umdocs.dev.reirapid.net/swagger-ui/index.html
- STAGING: https://umdocs.stg.reirapid.net/swagger-ui/index.html

Not deploying the swagger service on production.

<br>

## Swagger Documentation

The swagger documantion for the service is implemented in Java spring and is found in the /swagger directory. 

The deployment for the swagger documentation is found in /ci-cd/ecsalb. This CDK application will deploy an ECS Fargate service, which is accessed via AWS ALB. The ALB will have a custom domain name and certificate. The /ci-cd/ecslab/container directory contains the Docker defintion for the container. The pipeline will build the Java jar file, using maven and copy this file to the container. The CDK will create the container and register the container image in AWS ECR.

<br>

## Getting Started with CDK

The CDK has three basic elements. There is an Application, this is defined in <a href="https://github.com/REI-Systems/REISystems-OGST-USCIS-RAPID-Coding-Challenge-User-Management/blob/main/ci-cd/cdk/bin/user-mgt-sl-be.ts">ci-cd/cdk/bin/user-mgt-sl-be.ts</a>. There is a stack, this is defined in <a href="https://github.com/REI-Systems/REISystems-OGST-USCIS-RAPID-Coding-Challenge-User-Management/blob/main/ci-cd/cdk/lib/user-mgt-slbe-stack.ts">ci-cd/cdk/lib/user-mgmt-slbe-stack.ts</a>. Finally, there are constructs, these are used by the stack to build and deploy the application. The stacks are defined in ci-cd/cdk/lib/constructs.

This application is designed for developers to add/change functionality using a single construct. This construct defines the API Gateway and all REST end points.
The REST API end points are defined in the <a href="https://github.com/REI-Systems/REISystems-OGST-USCIS-RAPID-Coding-Challenge-User-Management/blob/main/ci-cd/cdk/lib/constructs/ApiGateway/index.ts">ci-cd/cdk/lib/constructs/ApiGateway/index.ts</a> file. When adding or changing REST end points the developer should make changes to the API Gateway construct.

Helpful documentation:
- AWS CDK Documentation: https://docs.aws.amazon.com/cdk/api/v2/ $\textcolor{silver}{↗}$
- HelpFul Book: AWS CDK in Practice: Unleash the power of ordinary coding and streamline complex cloud applications on AWS : https://www.amazon.com/gp/product/B0BJF8PRHD/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1 $\textcolor{silver}{↗}$
- GitHub Repo from the Book: https://github.com/PacktPublishing/AWS-CDK-in-Practice $\textcolor{silver}{↗}$
- Getting Started Reference: https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html $\textcolor{silver}{↗}$

<br>

## Deploying Code on a Local Environment

The developer will deploy changes into the development environment. They must be provided AWS keys to implement this functionality.

Once keys are provided the developer can use the CDK to deploy changes. This is accomplished using the CDK. The developer must first install:

- NodeJS (https://nodejs.org/en $\textcolor{silver}{↗}$)
- AWS CDK: ```npm install -g aws-cdk```
- Navigate to ci-cd/cdk and run ```npm install``` - this installs the packages required by the CDK

The specifics for an environment is defined in a directory under the ci-cd directory. Using development as the target, this environment is defined in the directory ci-cd/dev. The file <a href="https://github.com/REI-Systems/REISystems-OGST-USCIS-RAPID-Coding-Challenge-User-Management/blob/main/ci-cd/dev/cdk-spec.json">cdk-spec.json</a> contains all of the information about the environment. It is utilized by the CDK in the application startup. As a developer the deployment environment is defined by setting the variable:

- ```DEPLOY_ENV=dev```

On Mac this would be accomplished using the command ```export DEPLOY_ENV=dev```.

Now we are ready to run the CDK. Assuming that the AWS keys are defined in a profile the command would be:

- ```cdk deploy --require-approval never  --profile <<`Profile Name`>>```

<br>

## Testing

Requires that the environment variable APISERVER is set in the environment. The development environment would utilize:

- ```export APISERVER=rapidum.dev.reirapid.net```

Tests will have two basic types. Initially, there are tests to ensure that the REST functionality is working and continues to work. These tests are defined in the tests directory. There are two basic types that will be found, first are shell scripts which call a specific end point and return a result. If a TOKEN is required the ```./test-login.sh``` should be run. This will return a TOKEN, which can be exported into the environment. The other test is more roboust and will execute scenarios and check the exepcted results. This is run using the following command:

- ```node usermgmt.mjs```

This will require that the developer run npm install in the tests directory, which will install the required packages. The usermgmt.mjs contains all of the REST end points as well as reference example of all of the data required for each end point. This does not replace swagger - but it is useful to see how each end point is utilized.

The tests to implement coverage results, which are run in the GitHub pipeline will be available soon.

<br>

## Swagger Documentation

- DEV: https://umdocs.dev.reirapid.net/swagger-ui/index.html
- STAGING: https://umdocs.stg.reirapid.net/swagger-ui/index.html

The swagger is implemented in Java spring. it requires:
- <a href="https://www.oracle.com/java/technologies/javase/jdk20-archive-downloads.html">Java 20</a>$\textcolor{silver}{↗}$
- <a href="https://maven.apache.org/download.cgi">Maven</a>$\textcolor{silver}{↗}$

It will run on your localhost on port 80. 

The URL will be: http://localhost/swagger-ui/index.html

Swagger in the the /swagger directory it can be built and run using the following command:

- ```mvn install -DskipTests && java -jar target/docs*.jar```


