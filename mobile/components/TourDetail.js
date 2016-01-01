'use strict';

var React = require('react-native');
var PlaceDetail = require('./PlaceDetail');
var utils = require('../lib/utility');
var styles = require('../lib/stylesheet');

var {
  Image,
  View,
  Text,
  Component,
  ListView,
  TouchableHighlight,
  ActivityIndicatorIOS,
  ScrollView,
  MapView
} = React;

class TourDetail extends Component {

  /**
   * Creates an instance of TourDetail and sets the state with the tourId passed from props.
   * 
   * @constructor
   * @param {object} props is the tour object that was selected.
   * @this {TourDetail}
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      tourId: this.props.tour.id,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      mapRegion: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }, 
      annotations: []

    };
  }

  componentDidMount() {
    this.fetchData();
  }


  /**
   * Makes GET request to server for specifc tour and sets the places array from DB to the state.
   *
   */
  fetchData() {
    var component = this;
    var options = {
      reqBody: {},
      reqParam: this.state.tourId
    }; 

    utils.makeRequest('tour', component, options)
    .then((response) => {
      console.log('response body from TourDetail: ', response);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(response.places),
        isLoading: false
      });
    })
    .done();
  }

  renderLoadingView() {
    return (
      <View style={ styles.loading }>
        <ActivityIndicatorIOS
          size='large'/>
        <Text>
          Loading tours...
        </Text>
      </View>
    );
  }

  renderPlace(place) {
    var imageURI = (typeof place.image !== 'undefined') ? place.image : null;
    return (
      <TouchableHighlight onPress={ utils.navigateTo.bind(this,place.placeName, PlaceDetail, {place}) }  underlayColor='#dddddd'>
        <View>
          {/*<View style={styles.tourSeparator} />*/}
          <View style={ styles.placeContainer }>
            <Image source={{ uri: imageURI }} style={ styles.thumbnail }  />
            <View style={ styles.rightContainer }>
              <Text style={ styles.placeName }>{ place.placeName }</Text>
            </View>
            <Image source={ require('../assets/arrow.png') } style={ styles.arrow }></Image>
          </View>
          <View style={ styles.tourSeparator } />
        </View>
      </TouchableHighlight>
    );
  }
  
  render() {
    var tour = this.props.tour;
    var imageURI = (typeof tour.image !== 'undefined') ? tour.image : null;
    var tourName = (typeof tour.tourName !== 'undefined') ? tour.tourName : '';
    var description = (typeof tour.description !== 'undefined') ? tour.description : '';
    var cityName = (typeof tour.cityName !== 'undefined') ? tour.cityName : '';
    var category = (typeof tour.category !== 'undefined') ? tour.category : '';
    var duration = (typeof tour.duration !== 'undefined') ? tour.duration : '';

    return (
      <View style={styles.tourContainer}>
         <MapView
          style={styles.map}
          onRegionChange={this._onRegionChange}
          onRegionChangeComplete={this._onRegionChangeComplete}
          region={this.state.mapRegion}
          annotations={this.state.annotations}/>
      </View>
    );
  }
};
      //   <ScrollView automaticallyAdjustContentInsets={false}>

      //     <Text style={ [styles.tourTitle] }>{ tourName }</Text>
      //     <Text style={ [styles.description, {marginRight: 10}] }>
      //       <Text style={ styles.bold }>Description:</Text> { description + '\n' }
      //       <Text style={ styles.bold }>City:</Text> { cityName + '\n' }
      //       {/*<Text style={styles.bold}>Category:</Text> {category + '\n'}*/}
      //       <Text style={ styles.bold }>Est Time:</Text> { duration + ' hours'}
      //     </Text>
      //     <Text style={ styles.tourTitle }>Places</Text>
      //     <View style={ styles.tourSeparator } />
          
      //     <View style={ styles.panel }>
      //       <ListView
      //         dataSource={ this.state.dataSource }
      //         renderRow={ this.renderPlace.bind(this) }
      //         style={ styles.listView }
      //         automaticallyAdjustContentInsets={false} />
      //     </View>

      //   </ScrollView>
      // </View>

module.exports = TourDetail;
