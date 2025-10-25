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

export type StoryAgentProps = Omit<
  AgentCoreRuntimeProps,
  'runtimeName' | 'serverProtocol' | 'containerUri'
>;

export class StoryAgent extends Construct {
  public readonly dockerImage: DockerImageAsset;
  public readonly agentCoreRuntime: AgentCoreRuntime;

  constructor(scope: Construct, id: string, props?: StoryAgentProps) {
    super(scope, id);

    this.dockerImage = new DockerImageAsset(this, 'DockerImage', {
      platform: Platform.LINUX_ARM64,
      directory: path.dirname(url.fileURLToPath(new URL(import.meta.url))),
      extraHash: execSync(
        `docker inspect dungeon-adventure-story-agent:latest --format '{{.Id}}'`,
        { encoding: 'utf-8' },
      ).trim(),
    });

    this.agentCoreRuntime = new AgentCoreRuntime(this, 'StoryAgent', {
      runtimeName: Lazy.string({
        produce: () =>
          Names.uniqueResourceName(this.agentCoreRuntime, { maxLength: 40 }),
      }),
      serverProtocol: 'HTTP',
      containerUri: this.dockerImage.imageUri,
      ...props,
    });
  }
}
