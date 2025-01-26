import {
  Controller,
  Patch,
  Param,
  Body,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UpdateHiddenStatusDto } from './dto/update-hidden-status.dto';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all communities' })
  @ApiResponse({
    status: 200,
    description: 'List of all communities with their details',
    type: [CreateCommunityDto],
  })
  @Get()
  async findAll(): Promise<CreateCommunityDto[]> {
    return this.communitiesService.findAll();
  }

  @Get(':contractAddress')
  @ApiOperation({
    summary: 'Get detailed information for a specific community',
  })
  @ApiParam({
    name: 'contractAddress',
    description: 'Soroban contract address of the community',
    example:
      'CB5DQK6DDWRJHPWJHYPQGFK4F4K7YZHX7IHT6I4ICO4PVIFQB4RQAAAAAAAAAAAAAAAA',
  })
  @ApiResponse({
    status: 200,
    description: 'Community information excluding badge details',
    type: CreateCommunityDto,
  })
  @ApiResponse({ status: 404, description: 'Community not found' })
  async findOne(
    @Param('contractAddress') contractAddress: string,
  ): Promise<CreateCommunityDto> {
    const community = await this.communitiesService.findOne(contractAddress);
    if (!community) {
      throw new NotFoundException('Community not found');
    }
    return community;
  }

  @Patch(':contractAddress/visibility')
  @ApiOperation({ summary: 'Update community visibility status' })
  @ApiParam({
    name: 'contractAddress',
    description: 'Soroban contract address of the community',
    example:
      'CB5DQK6DDWRJHPWJHYPQGFK4F4K7YZHX7IHT6I4ICO4PVIFQB4RQAAAAAAAAAAAAAAAA',
  })
  @ApiResponse({
    status: 200,
    description: 'Community visibility status updated successfully',
    type: CreateCommunityDto,
  })
  @ApiResponse({ status: 404, description: 'Community not found' })
  async updateVisibility(
    @Param('contractAddress') contractAddress: string,
    @Body() updateHiddenStatusDto: UpdateHiddenStatusDto,
  ): Promise<CreateCommunityDto> {
    const updatedCommunity = await this.communitiesService.updateVisibility(
      contractAddress,
      updateHiddenStatusDto.isHidden,
    );

    if (!updatedCommunity) {
      throw new NotFoundException('Community not found');
    }

    return updatedCommunity;
  }
}
