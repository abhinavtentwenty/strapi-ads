import React from 'react';
import { useParams } from 'react-router-dom';
import CampaignForm from '../components/campaignForm';

const ViewCampaign = () => {
  const { id } = useParams();
  return <CampaignForm mode="view" campaignId={id} />;
};

export default ViewCampaign;
