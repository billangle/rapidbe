
import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, TableV2, StreamViewType, Billing, Capacity} from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';


interface Props {
  tableName: string;
  partKey: string;
  sortKey: string;
}

export class DynamoDBAllKeys extends Construct {
  readonly table: TableV2;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.table = new TableV2(this, props.tableName, {
      partitionKey: { name: props.partKey, type: AttributeType.STRING },
      sortKey: { name: props.sortKey, type: AttributeType.STRING },
      tableName: props.tableName,
      removalPolicy: RemovalPolicy.DESTROY,
      deletionProtection: false,
      pointInTimeRecovery: true,
      dynamoStream: StreamViewType.NEW_IMAGE,
      billing: Billing.provisioned ({
        readCapacity: Capacity.autoscaled({maxCapacity: 15}),
        writeCapacity: Capacity.autoscaled({maxCapacity: 15})

      })
    });

  }
  
}
