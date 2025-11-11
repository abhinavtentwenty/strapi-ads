import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';

export default function ExportReportCsvModal({ isOpen, setIsOpen, onSubmit }) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      label="export-report-csv-title"
    >
      <h3 style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
        Export Report as CSV File
      </h3>
      <p style={{ fontSize: '16px' }}>
        A CSV file will be generated with all selected data. You can open it in Excel, Google
        Sheets, or any spreadsheet tool.
      </p>
    </CustomModal>
  );
}
