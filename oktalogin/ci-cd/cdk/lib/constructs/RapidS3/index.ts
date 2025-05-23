import {
    Bucket,
    BucketAccessControl,
  } from 'aws-cdk-lib/aws-s3';
  import { Construct } from 'constructs';
  import {  RemovalPolicy } from 'aws-cdk-lib';



  interface Props {
    env: string;
    base_name: string;
  }


  
  export class RapidS3 extends Construct {
  
  
    constructor(scope: Construct, id: string, props: Props) {
      super(scope, id);
  
     let bucketName=`${props.base_name}-${props.env}`;

     const DataBucket = new Bucket(
        scope,
        `RapidCC-Data-${bucketName}`,
        {
          bucketName: bucketName,
          publicReadAccess: false,
          accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
          removalPolicy: RemovalPolicy.DESTROY,
          autoDeleteObjects: true,
        },
      );
   
  
    }
  }
  