import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';
import { Typography, Flex } from '@strapi/design-system';

export default function ExportReportCsvModal({ isOpen, setIsOpen, onSubmit }) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      label="export-report-csv-title"
    >
      <Flex direction="column" gap={2}>
        <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          Export Report as CSV File
        </Typography>
        <Typography style={{ fontSize: '16px' }}>
          A CSV file will be generated with all selected data. You can open it in Excel, Google
          Sheets, or any spreadsheet tool.
        </Typography>
      </Flex>
    </CustomModal>
  );
}
