
The User Management service, will manage users in **AWS Cognito User Pool**. The ci-cd/cdk directory contains the CDK code to create the AWS infrastructure required for this service. The CDK is also utilized to deploy all **Lambda** functions and REST endpoints into the **API Gateway**. 


-----

## GitHub Actions and Workflows

There are are GitHub workflows to create and deploy all AWS resources as well as code required for this feature. 



<br>

## Swagger Documentation

The swagger documantion for the service is implemented in Java spring and is found in the /swagger directory. 

The deployment for the swagger documentation is found in /ci-cd/ecsalb. This CDK application will deploy an ECS Fargate service, which is accessed via AWS ALB. The ALB will have a custom domain name and certificate. The /ci-cd/ecslab/container directory contains the Docker defintion for the container. The pipeline will build the Java jar file, using maven and copy this file to the container. The CDK will create the container and register the container image in AWS ECR.

<br>

## Getting Started with CDK



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

The specifics for an environment is defined in a directory under the ci-cd directory. Using development as the target, this environment is defined in the directory ci-cd/dev. The file cdk-spec.json contains all of the information about the environment. It is utilized by the CDK in the application startup. As a developer the deployment environment is defined by setting the variable:

- ```DEPLOY_ENV=dev```

On Mac this would be accomplished using the command ```export DEPLOY_ENV=dev```.

Now we are ready to run the CDK. Assuming that the AWS keys are defined in a profile the command would be:

- ```cdk deploy --require-approval never  --profile <<`Profile Name`>>```

<br>

## Testing

Requires that the environment variable APISERVER is set in the environment. The development environment would utilize:

- ```export APISERVER=rapidum.rapidright.net```

Tests will have two basic types. Initially, there are tests to ensure that the REST functionality is working and continues to work. These tests are defined in the tests directory. There are two basic types that will be found, first are shell scripts which call a specific end point and return a result. If a TOKEN is required the ```./test-login.sh``` should be run. This will return a TOKEN, which can be exported into the environment. The other test is more roboust and will execute scenarios and check the exepcted results. This is run using the following command:

- ```node usermgmt.mjs```

This will require that the developer run npm install in the tests directory, which will install the required packages. The usermgmt.mjs contains all of the REST end points as well as reference example of all of the data required for each end point. This does not replace swagger - but it is useful to see how each end point is utilized.


<br>

## Swagger Documentation


The swagger is implemented in Java spring. it requires:
- <a href="https://www.oracle.com/java/technologies/javase/jdk20-archive-downloads.html">Java 20</a>$\textcolor{silver}{↗}$
- <a href="https://maven.apache.org/download.cgi">Maven</a>$\textcolor{silver}{↗}$

It will run on your localhost on port 80. 

The URL will be: http://localhost/swagger-ui/index.html

Swagger in the the /swagger directory it can be built and run using the following command:

- ```mvn install -DskipTests && java -jar target/docs*.jar```


