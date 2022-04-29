# Kaholo Google Sheets Plugin
This plugin integrates Kaholo with [Google Sheets](https://www.google.com/sheets/about/). Google Sheets allows you to create and collaborate on online spreadsheets in real-time and from any device.

The main purpose of this first version of the plugin is to automate data entry. To that end, it is able to create a new spreadsheet, add sheets, and write data to specific rows or just append new rows. It is also able to grant access to individuals based on their email addresses.

This plugin may be expanded with additional functionality if driven by [user request](https://kaholo.io/contact/). Please do let us know which features you'd like to see next.

## Prerequisites
This plugin requires a few things be configured in the Google Cloud Platform prior to using the plugin. First you need a service account and JSON format credentials for that account. This is no different from the other Google plugins - for example Google Cloud Compute, Google Kubernetes Engine, or Google Cloud CLI (gcloud) plugins - and the same service account may be used for all.

The following Google APIs must be enabled. This is done in the Google Cloud Platform [API Library](https://console.cloud.google.com/apis/library).

>**Google Sheets API**
>
>**Google Drive API**

## Access and Authentication
The Google Sheets plugin uses a set of service account keys (Credentials) for access and authentication.

* Credentials - JSON format service account keys as downloaded from GCP, stored in Kaholo Vault.

Credentials is a required parameter for all methods in this plugin.

When creating keys for a GCP service account, they can be downloaded in either JSON or P12 format. The JSON format is required for Kaholo plugins. Store the entire JSON document in a Kaholo Vault item. The Kaholo Vault allows them to be safely used without exposing the keys in log files, error messages, execution results, or any other output.

## Plugin Installation
For download, installation, upgrade, downgrade and troubleshooting of plugins in general, see [INSTALL.md](./INSTALL.md).

## Plugin Settings
Plugin settings act as default parameter values. If configured in plugin settings, the action parameters may be left unconfigured. Action parameters configured anyway over-ride the plugin-level settings for that Action. There is only one setting for this plugin:

* Default Credentials - JSON format service account keys as downloaded from GCP, stored in Kaholo Vault.

## Method: Start a New Spreadsheet
This method creates a new Google Sheets spreadsheet owned by the service account. To be able to access and use the sheet, at least one Authorized User must be specified. The URL of the new spreadsheet can be found in Final Results on the Kaholo Execution Results page.

### Parameters
1. Spreadsheet Title - A name for the new spreadsheet
1. Sheet Name - A name for the first (and only) sheet in the new Spreadsheet
1. Authorized Users - One or more email addresses of users who will be editors of the spreadsheet (one per line)

## Method: Add a New Sheet
This method adds a new sheet to an existing Google Sheets spreadsheet.

### Parameters
1. Spreadsheet URL - the URL of an existing spreadsheet, e.g. `https://docs.google.com/spreadsheets/d/18nfMDZn9MlYyff_4MCO8J-UUh4MQQeIAtypaOt0z2zQ/edit`
1. Sheet Name - A name for the additional sheet, must be unique within the spreadsheet.

## Method: Insert Row
This inserts a row of data into a sheet. The data is entered one-per-line, the first line being the value in column A, the second line column B, and so on. An empty line will result in an empty cell in the row. For example:

    23.5
    10.53
    unk

    38.2

This example would put 38.2 in column E and column D would be empty.

If a row number is specified and that row already contains data, the data is overwritten. A row can be overwritten with all empty lines to get a "Delete Row" effect.

If NO row number is specified, the data is inserted into the first empty row.

### Parameters
1. Spreadsheet URL - the URL of an existing spreadsheet
1. Sheet Name - the name of an existing sheet in that spreadsheet
1. Data - a list of values, one per row, to insert into the spreadsheet
1. Row Number - the row in which the data will be inserted, overwriting existing data. If not specified the insert is in the first empty row.

## Method: Modify Access Rights
For access rights there are two types of sharing:
* Restricted - individual users are assigned rights to view, comment or edit the spreadsheet.
* Unrestricted - anybody with the URL is able to edit the spreadsheet.

If Unrestricted the remaining parameters don't matter and may be left unspecified.

If restricted, three kinds of access can be granted:
* viewers - read only access
* commenters - read only plus able to enter comments
* editors - full read/write access to the spreadsheet

Email addresses should be added one-per-line, e.g.
    
    brad@kaholo.io
    sally@kaholo.io
    abe@kaholo.io

Notify Message is a text message sent along to email addresses granted access to inform the user about the nature of the spreadsheet to which they've been granted access, for example "Water sample laboratory test results spreadsheet."

### Parameters
1. Spreadsheet URL - the URL of an existing spreadsheet
1. Sharing - either restricted or unrestricted
1. Viewers - email addresses of those who are viewers
1. Commenters - email addresses of those who can comment
1. Editors - email addresses of those with full editing rights
1. Notify Message - message sent when informing end users of their new access rights
1. Overwrite Existing Access Rights - if selected, these rights replace all existing ones instead of being added to the existing ones.
