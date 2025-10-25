import { Lazy, Names } from 'aws-cdk-lib';
import { DockerImageAsset, Platform } from 'aws-cdk-lib/aws-ecr-assets';
import { Construct } from 'constructs';
import { execSync } from 'child_process';
import * as path from 'path';
import * as url from 'url';
import {
  AgentCoreRuntime,
  AgentCoreRuntimeProps,
} from '../../../core/agent-core/runtime.js';

export type InventoryMcpServerProps = Omit<
  AgentCoreRuntimeProps,
  'runtimeName' | 'serverProtocol' | 'containerUri'
>;

export class InventoryMcpServer extends Construct {
  public readonly dockerImage: DockerImageAsset;
  public readonly agentCoreRuntime: AgentCoreRuntime;

  constructor(scope: Construct, id: string, props?: InventoryMcpServerProps) {
    super(scope, id);

    this.dockerImage = new DockerImageAsset(this, 'DockerImage', {
      platform: Platform.LINUX_ARM64,
      directory: path.dirname(url.fileURLToPath(new URL(import.meta.url))),
      extraHash: execSync(
        `docker inspect dungeon-adventure-inventory-mcp-server:latest --format '{{.Id}}'`,
        { encoding: 'utf-8' },
      ).trim(),
    });

    this.agentCoreRuntime = new AgentCoreRuntime(this, 'InventoryMcpServer', {
      runtimeName: Lazy.string({
        produce: () =>
          Names.uniqueResourceName(this.agentCoreRuntime, { maxLength: 40 }),
      }),
      serverProtocol: 'MCP',
      containerUri: this.dockerImage.imageUri,
      ...props,
    });
  }
}
