'use strict';

var React = require('react-native');
var ViewCreatedTour = require('./ViewCreatedTour');
var SelectImage = require('./SelectImage');
var utils = require('../lib/utility');
var t = require('tcomb-form-native');
var Form = t.form.Form;
var styles = require('../lib/stylesheet');

var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Image
} = React;

// Place defines domain model for form.
var Place = t.struct({
  placeName: t.maybe(t.String),
  address: t.maybe(t.String),
  description: t.maybe(t.String),
  placeOrder: t.maybe(t.Number)
});

var options = {
  auto: 'placeholders',
  fields: {
    placeName: {
      placeholder: 'Place',
      placeholderTextColor: '#FFF',
    },
    address: {
      placeholder: 'Address',
      placeholderTextColor: '#FFF'
    },
    description: {
      placeholder: 'Description',
      placeholderTextColor: '#FFF'
    },
    placeOrder: {
      placeholder: 'Order',
      placeholderTextColor: '#FFF'
    }
  },
};

class AddPlace extends Component {
  
  /**
   * Creates an instance of AddPlace.
   */
  constructor(props) {
    super(props);
    this.state = {
      tourId: this.props.tourId || this.props.route.passProps.tourId,
      placeId: null
    };
  }

  /**
   * Gets place details using tcomb-form-native getValue method and posts it in the database.
   */
  onPressSave () {
    /**
     * getValue() gets the values of the form.
     */
    var tourId = this.state.tourId;
    var newPlace = this.refs.form.getValue();
    var options = {
      reqBody: {
                placeName: newPlace.placeName,
                address: newPlace.address,
                description: newPlace.description,
                //placeOrder: newPlace.placeOrder,
                tourId: tourId
              }
    };

    var component = this;
    utils.makeRequest('addPlace', component, options)
      .then(response => {
        console.log('HELLOOOO THERE')
        console.log('response body in Add Place: ', response);
        component.setState({
          placeId: response.id.placeId
        })
        var props = {
          placeId: this.state.placeId,
          tourId: this.state.tourId
        }
        utils.navigateTo.call(this, "Add a Photo", SelectImage, props);
      });
  }

  addPhoto() {
    /*TODO: this should send a put request to update place photo, needs placeId*/
    var tourId = this.state.tourId;
    utils.navigateTo.call(this, "Select a Tour Photo", SelectImage, {tourId});
  }

  /**
   * renders a form generated by tcomb-form-native based on the domain model 'Place'.
   */
  render () {
    return (
      <View style={ styles.addPlaceContainer }>
        {/* display */}
        <View style={{marginTop: 70}}>
          <Form
            ref="form"
            type={ Place }
            options={ options }/>
        </View>
       
        
          <TouchableHighlight onPress={ this.addPhoto.bind(this) } underlayColor='#727272' style={{marginTop: 25}}>
            <View style={ styles.photoAudioContainer }>   
              <View style={{marginTop: 25}}>
                <Text style={ styles.text }>Add a Photo</Text>
              </View>
              <View>
                <Image source={require('../assets/photoicon.png')} style={styles.photoIcon}/> 
              </View>
            </View>   
          </TouchableHighlight>
          
            
          <TouchableHighlight onPress={() => alert('add Audio')} underlayColor='#727272' style={{marginTop: 20}}>
            <View style={ styles.photoAudioContainer }>
              <View style={{marginTop: 25}}>
                <Text style={ styles.text }>Add Audio</Text>
              </View>
              <View>
                <Image source={require('../assets/audioicon.png')} style={styles.audioIcon}/>
              </View>
            </View>  
          </TouchableHighlight>

        <TouchableHighlight 
          style={ styles.button } 
          onPress={ this.onPressSave.bind(this) } 
          underlayColor='#FFC107'>
          <Text style={ styles.buttonText }>Add Place</Text>
        </TouchableHighlight>
      </View>
    );
  }
};

//node-modules/tcomb-form-native/lib/stylesheet/bootstrap
// var LABEL_COLOR = '#000000';
// var INPUT_COLOR = '#FFF';
// var ERROR_COLOR = '#a94442';
// var HELP_COLOR = '#999999';
// var BORDER_COLOR = '#cccccc';
// var DISABLED_COLOR = '#777777';
// var DISABLED_BACKGROUND_COLOR = '#D8D8D8';
// var FONT_SIZE = 17;
// var FONT_WEIGHT = '500';
// textbox: {
//     normal: {
//       color: INPUT_COLOR,
//       fontSize: FONT_SIZE,
//       height: 45,
//       padding: 7,
//       borderRadius: 5,
//       borderColor: BORDER_COLOR,
//       borderWidth: 1,
//       marginBottom: 10,
//       backgroundColor: DISABLED_BACKGROUND_COLOR
//     },

module.exports = AddPlace;
