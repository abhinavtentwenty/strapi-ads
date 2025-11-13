import React from 'react';
import { useParams } from 'react-router-dom';
import CampaignForm from '../components/campaignForm';

const EditCampaign = () => {
  const { id } = useParams();

  return <CampaignForm mode="edit" campaignId={id} />;
};

export default EditCampaign;
