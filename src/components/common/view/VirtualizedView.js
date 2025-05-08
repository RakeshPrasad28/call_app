import React, {PureComponent, useRef} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';

class VirtualizedView extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[{flex: 1}]}>
        <FlatList
          data={[]}
          ListEmptyComponent={null}
          keyExtractor={(item, index) => 'VirtualizedView' + index.toString()}
          key={'VirtualizedView'}
          renderItem={({item, index}) => {}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={this.props.style}
          onScroll={scrollEvent => {
            if (this.props.onScrollEndDrag) {
              this.props.onScrollEndDrag(scrollEvent);
            }
          }}
          refreshControl={
            this.props.onRefresh ? (
              <RefreshControl
                onRefresh={() => {
                  if (this.props.onRefresh) {
                    this.props.onRefresh();
                  }
                }}
                refreshing={this.props.refreshing || false}
              />
            ) : null
          }
          ListHeaderComponent={
            <React.Fragment>{this.props.children}</React.Fragment>
          }
          {...this.props}
        />
      </View>
    );
  }
}
export default VirtualizedView;
