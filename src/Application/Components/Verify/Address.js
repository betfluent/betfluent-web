// @flow

import React, { Component } from "react";
import AutoComplete from "../../Extensions/AutoCompleteExt";

type AddressProps = {
  defaultValue: string,
  onError: () => void,
  receiveStreet: () => void,
  receiveAddress: () => void,
  errorText: string
};

export default class Address extends Component<AddressProps> {
  constructor() {
    super();
    this.autocompleteCallback = this.autocompleteCallback.bind(this);
    this.fetchPredictions = this.fetchPredictions.bind(this);
    this.selectAddress = this.selectAddress.bind(this);
    this.parseAddress = this.parseAddress.bind(this);
    this.options = {
      types: ["address"],
      componentRestrictions: { country: "us" }
    };
    this.state = {
      autocompleteItems: [],
      street: ""
    };
  }

  componentDidMount() {
    if (!window.google) {
      throw new Error("Google Maps JavaScript API library must be loaded.");
    }

    if (!window.google.maps.places) {
      throw new Error(
        "Google Maps Places library must be loaded. Please add `libraries=places` to the src URL."
      );
    }

    const google = window.google;
    this.geocoder = new google.maps.Geocoder();
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.autocompleteOK = google.maps.places.PlacesServiceStatus.OK;
  }

  autocompleteCallback(predictions, status) {
    if (status !== this.autocompleteOK) {
      this.props.onError(status, this.clearSuggestions);
      return;
    }

    this.setState({
      autocompleteItems: predictions.map(p => ({
        suggestion: p.description,
        placeId: p.place_id
      }))
    });
  }

  fetchPredictions(address) {
    const street = address;
    this.setState({ street });
    this.props.receiveStreet(street);
    if (street.length) {
      this.autocompleteService.getPlacePredictions(
        {
          ...this.options,
          input: street
        },
        this.autocompleteCallback
      );
    }
  }

  parseAddress(address) {
    let [street, city, stateZip] = address.split(",");
    street = street ? street.trim() : "";
    city = city ? city.trim() : "";
    stateZip = stateZip ? stateZip.trim() : "";
    let [state, zip] = stateZip.split(" ");
    state = state ? state.trim() : "";
    zip = zip ? zip.trim() : "";
    this.props.receiveAddress({ street, city, state, zip });
    this.setState({ street });
  }

  selectAddress(obj) {
    const placeId = obj.placeId;
    this.geocoder.geocode({ placeId }, results => {
      this.parseAddress(results[0].formatted_address);
    });
  }

  render() {
    const rootStyle = {
      width: "100%"
    };

    const dataSourceConfig = {
      text: "suggestion",
      value: "placeId"
    };

    return (
      <AutoComplete
        id="street"
        textFieldStyle={rootStyle}
        style={rootStyle}
        listStyle={rootStyle}
        menuStyle={rootStyle}
        className="formInputStyle"
        filter={AutoComplete.caseInsensitiveFilter}
        floatingLabelText="Address Line 1"
        searchText={this.state.street || this.props.defaultValue}
        dataSource={this.state.autocompleteItems}
        dataSourceConfig={dataSourceConfig}
        onUpdateInput={this.fetchPredictions}
        onNewRequest={this.selectAddress}
        errorText={this.props.errorText}
      />
    );
  }
}

/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
Address.defaultProps = {
  onError: () => null,
  classNames: {},
  renderSuggestion: ({ suggestion }) => <div>{suggestion}</div>,
  styles: {},
  options: {},
  debounce: 200,
  highlightFirstSuggestion: false,
  shouldFetchSuggestions: () => true
};
