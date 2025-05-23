import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as fs from 'fs';
import { EcsalbStack } from '../lib/ecsalb-stack';


/**
 * REQUIRES 
 * 
 * DEPLOY_ENV
 * 
 * aws configure sso for REI
 * export ADMINUSER
 * 
 * 
 */



let environment=process.env.DEPLOY_ENV;
const envdata = fs.readFileSync("../" + environment+ '/cdk-spec.json', 'utf8');
const configData = JSON.parse(envdata);

const app = new cdk.App();
new EcsalbStack(app, 'EcsalbStack', {
  env: { region: configData.settings.region, account: configData.settings.account },
  configData: configData
});