import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

interface Props {
  hosted_zone: IHostedZone;
  domain: string;
  region: string;
}

export class ACM extends Construct {
  public readonly certificate: acm.Certificate;
//  region: props.region - doesn't work - needs to be in us-east-1,
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    console.log ("Generating CERT for " + props.domain);
    const certName = 'SiteCertificate' + props.domain;

    this.certificate = new acm.Certificate(this, certName, {
      domainName: props.domain,
      validation: acm.CertificateValidation.fromDns(props.hosted_zone),
    });
  }
}
