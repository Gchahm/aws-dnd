# 🎮 AI-Powered Dungeon Adventure

> A full-stack, cloud-native demo application showcasing modern AWS architecture, AI integration, and type-safe development practices.

## Overview

This project demonstrates the integration of cutting-edge technologies to build a complete, production-ready application. It features AI-generated storytelling, real-time inventory management, and a fully serverless architecture deployed on AWS.

**Live Demo**: [https://d5v0i8bfb0kz7.cloudfront.net/](https://d5v0i8bfb0kz7.cloudfront.net/)

## 🌟 Key Features

### AI-Powered Storytelling
- **Dynamic Narrative Generation**: Uses AWS Bedrock with Strands Agents to create unique dungeon stories
- **Context-Aware Responses**: AI adapts to player choices and inventory state

### Model Context Protocol (MCP) Integration
- **Natural AI Interaction**: MCP server enables AI to query and modify game inventory seamlessly
- **Real-time Database Access**: AI agents interact with DynamoDB through standardized protocol

### Type-Safe API Layer
- **tRPC Implementation**: Full end-to-end type safety between frontend and backend
- **Zero Code Generation**: Instant autocomplete and type-checking for all API calls
- **Auto-mapped Lambda Functions**: Each tRPC route automatically becomes an AWS Lambda function

### Modern Frontend
- **React 19**: Latest React features with concurrent rendering
- **TanStack Router & Query**: Type-safe routing and efficient data fetching
- **AWS Cloudscape Design**: Professional UI components following AWS design patterns
- **Cognito Authentication**: Secure user authentication and authorization

## 🏗️ Architecture

This monorepo is organized into specialized packages:

```
packages/
├── game-ui/       # React frontend with TanStack Router
├── game-api/      # tRPC API layer with Lambda integration
├── story/         # Python Strands Agent for AI storytelling
├── inventory/     # TypeScript MCP Server for inventory management
├── infra/         # AWS CDK infrastructure as code
└── common/        # Shared types and utilities
```

### Technology Stack

**Frontend**
- React 19
- TypeScript
- TanStack Router & Query
- AWS Cloudscape Design System
- Vite

**Backend**
- tRPC for type-safe APIs
- AWS Lambda (serverless functions)
- DynamoDB (NoSQL database)
- AWS Cognito (authentication)

**AI & Agents**
- AWS Bedrock (AI foundation models)
- Python Strands Agent (story generation)
- TypeScript MCP Server (inventory context)

**Infrastructure**
- AWS CDK (Infrastructure as Code)
- CloudFront (CDN)
- S3 (static hosting)
- API Gateway

**Development Tools**
- Nx (monorepo management)
- TypeScript
- ESLint & Prettier
- Vitest (testing)

## 🚀 Getting Started

### Prerequisites

- Node.js 22.12.0
- pnpm
- AWS CLI configured
- Python 3.x with uv

### Installation

```sh
# Install dependencies
pnpm install

# Install Python dependencies
uv sync
```

### Development

```sh
# Run the frontend dev server
pnpm exec nx serve @dungeon-adventure/game-ui

# Build all projects
pnpm exec nx run-many --target build --all

# Run tests
pnpm exec nx run-many --target test --all
```

### Deployment

```sh
# Deploy infrastructure
pnpm exec nx deploy @dungeon-adventure/infra

# Load runtime configuration
pnpm exec nx run @dungeon-adventure/game-ui:load:runtime-config
```

## 📦 Package Details

### game-ui
React-based frontend with Cognito authentication, TanStack Router for navigation, and AWS Cloudscape components for a polished user experience.

### game-api
tRPC API providing type-safe endpoints that automatically map to AWS Lambda functions. Includes integration with DynamoDB for persistent storage.

### story
Python-based Strands Agent that generates dynamic dungeon narratives using AWS Bedrock. Responds to player actions with contextually appropriate story elements.

### inventory
TypeScript MCP Server enabling AI agents to query and modify player inventory through a standardized protocol, bridging the gap between AI and application state.

### infra
AWS CDK application defining the complete cloud infrastructure including Lambda functions, DynamoDB tables, CloudFront distribution, S3 buckets, and Cognito user pools.

## 🎯 What This Demo Showcases

1. **Full-Stack Type Safety**: End-to-end TypeScript with tRPC eliminates API contract mismatches
2. **AI Integration Patterns**: Real-world implementation of AI agents in production applications
3. **Serverless Architecture**: Cost-effective, scalable infrastructure using AWS managed services
4. **Modern DevOps**: Nx monorepo with efficient build caching and task orchestration
5. **Infrastructure as Code**: Complete AWS environment defined in CDK with TypeScript
6. **Model Context Protocol**: Cutting-edge AI context management for intelligent applications

## 📚 Learning Resources

This project was built following the AWS Nx Plugin tutorial:
- [AWS Nx Plugin Documentation](https://awslabs.github.io/nx-plugin-for-aws)
- [Dungeon Game Tutorial](https://awslabs.github.io/nx-plugin-for-aws/en/get_started/tutorials/dungeon-game/overview/)

## 🛠️ Development Commands

```sh
# Build a specific project
pnpm exec nx build <project-name>

# Run lint with auto-fix
pnpm exec nx run-many --target lint --configuration=fix --all

# Update test snapshots
pnpm exec nx run-many --target test --all --update

# Sync TypeScript project references
pnpm exec nx sync
```

## 📄 License

MIT

---

**Built with**: AWS, React, TypeScript, Python, Nx, and ☕
