// @flow
/* eslint-disable */

/* eslint-disable react/style-prop-object */

import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Editor } from "@tinymce/tinymce-react";
import { getFund, getFundDetails } from "../../Services/DbService";
import {
  updateFundDetails,
  UploadSummaryImage
} from "../../Services/ManagerService";
import { mgMuiTheme } from "../ManagerStyles";

const alertColor = mgMuiTheme.palette.alertColor;

type EditFundProps = {
  user: User,
  match: {
    params: {
      fund: string
    }
  },
  history: {
    push: () => void,
    goBack: () => void
  }
};

export default class EditFund extends Component<EditFundProps> {
  constructor(props) {
    super(props);
    this.fundId = props.match.params.fund;
    this.navBack = this.navBack.bind(this);
    this.state = {
      open: false
    };
  }

  componentWillMount() {
    getFund(this.fundId).then(fund => {
      const name = fund.name;
      const status = fund.status;
      getFundDetails(this.fundId).then(details => {
        if (details) {
          const summary = details.summaryHtml;
          this.setState({ summary, name, status });
        } else this.setState({ name, status });
      });
    });
  }

  // This is to ensure that image dimensions are not hardcoded
  // so that the image can be displayed properly for different screen sizes.
  // Gives less control/responsibility to the fund manager to customize image size
  handleEditorNodeChange = e => {
    if (e && e.element.nodeName.toLowerCase() === "img") {
      this.editor.dom.setAttribs(e.element, {
        width: null,
        height: null
      });
    }
  };

  handleEditorChange = e => {
    const summary = e.target.getContent();
    this.setState({ summary });
  };

  saveFundSummary = () => {
    updateFundDetails(this.fundId, {
      summaryHtml: this.state.summary
    });
    window.setTimeout(() => {
      this.setState({ fundCreated: false });
      if (this.state.status === "OPEN") {
        this.props.history.push("/manage#1");
      } else {
        this.props.history.push("/manage#0");
      }
    }, 1000);
  };

  navBack() {
    this.props.history.goBack();
  }

  render() {
    if (!this.props.user || !this.state.name) return null;

    return (
      <MuiThemeProvider muiTheme={mgMuiTheme}>
        <div style={{ width: "90%", margin: "0 auto 54px" }}>
          <div style={{ margin: "48px 0" }}>
            <Editor
              content={this.state.summary}
              initialValue={this.state.summary}
              init={{
                setup: editor => {
                  this.editor = editor;
                },
                plugins: [
                  "advlist autolink lists link image charmap preview hr anchor pagebreak",
                  "searchreplace wordcount visualblocks visualchars code",
                  "insertdatetime media nonbreaking table contextmenu directionality",
                  "emoticons template paste textcolor colorpicker textpattern imagetools codesample"
                ],
                toolbar:
                  "codesample | bold italic underline | sizeselect fontselect fontsizeselect | hr alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | insertfile undo redo | forecolor backcolor emoticons | code",
                height: 500,
                images_upload_handler: (blobInfo, success) => {
                  UploadSummaryImage({
                    fileName: blobInfo.filename(),
                    blob: blobInfo.blob()
                  })
                    .then(snapshot => snapshot.ref.getDownloadURL())
                    .then(url => success(url));
                }
              }}
              onChange={this.handleEditorChange}
              onNodeChange={this.handleEditorNodeChange}
            />
          </div>
          <RaisedButton
            primary
            style={{ marginRight: 10 }}
            label="UPDATE SUMMARY"
            onClick={this.saveFundSummary}
          />
          <RaisedButton
            label="CANCEL"
            style={{ marginLeft: 10 }}
            labelStyle={{ color: alertColor }}
            onClick={() => {
              this.props.history.goBack();
            }}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
