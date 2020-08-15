import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { postFavorite, postComment } from '../redux/ActionCreators';
import { baseUrl } from '../shared/baseUrl';
import { connect } from 'react-redux';
import { CAMPSITES } from '../shared/campsites';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = {
    postFavorite,
    postComment
};

function RenderCampsite(props) {

    const { campsite } = props;
    if (campsite) {
        return (
            <Card
                featuredTitle={campsite.name}
                image={{ url: baseUrl + campsite.imag }}>
                <Text style={{ margin: 10 }}>
                    {campsite.description}
                </Text>
                <View style={styles.cardRow} >
                    <Icon
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        raised
                        reverse
                        onPress={() => props.favorite ?
                            console.log('Already set as a favorite') : props.markFavorite()}
                    />
                    <Icon
                        name={'pencil'}
                        type='font-awesome'
                        color='#5637DD'
                        style={styles.cardItem}
                        raised
                        reverse
                        onPress={() => props.onShowModal()}

                    />
                </View>
            </Card>
        );
    }
    return;
}
function RenderComments({ comments }) {

    const renderCommentItem = ({ item }) => {
        return (
            <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };

    return (
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class CampsiteInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            campsites: CAMPSITES,
            comments: COMMENTS,
            favorite: false,
            ShowModal: false
        };
    }
    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    static navigationOptions = {
        title: 'Campsite Information'
    };
    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }


    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite campsite={campsite}
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                    onShowModal={() => this.toggleModal()}
                />
                <RenderComments comments={comments} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.modal}>

                        <Rating
                            showRating
                            type='star'
                            fractions={0}
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={rating => this.setState({ rating: rating })}
                            style={{ paddingVertical: 10 }}
                        />
                        <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={author => { this.setState({ author: author }) }}
                            value={this.state.author}
                        />
                        <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            onChangeText={author => { this.setState({ text: text }) }}
                            style={{ paddingVertical: 10 }}
                            value={this.state.text}
                        />
                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => { this.handleComment(campsiteIdI); this.resetForm();}}
                                color='#5637DD'
                                title='Submit'
                                />
                                 <Button
                                  onPress={() =>{this.toggleModal(); this.resetForm();}}
                                 color='#808080'
                                title='Cancel'
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1,
        margin: 10
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
