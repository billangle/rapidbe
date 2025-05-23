import { HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';


interface Props {
  domain: string;
}



export class Route53 extends Construct {
  public readonly hosted_zone: IHostedZone;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.hosted_zone = HostedZone.fromLookup(scope, 'HostedZone', {
      domainName: props.domain,
    });
  }
}
