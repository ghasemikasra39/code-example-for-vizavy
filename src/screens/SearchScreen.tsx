import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Animated,
  ActivityIndicator,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Globals from '../component-library/Globals';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import axios from 'axios';
import { noPeopleFound } from '../component-library/graphics/Images';
import { useNavigation } from '@react-navigation/native';
import { Bugtracker } from '../services/utility/BugTrackerService';
import HapticFeedBackWrapper from '../component-library/HapticFeedBackWrapper';
import UserListItem from '../component-library/UserListItem';
import IllustrationExplainer from '../component-library/IllustrationExplainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import TinyArrow from '../component-library/graphics/Icons/TinyArrow';
import SearchManager from '../services/api/SearchManager';
import SearchIcon from '../component-library/graphics/Icons/SearchIcon';
import CloseIcon from '../component-library/graphics/Icons/CloseIcon';
import NoPeopleFoundIcon from '../component-library/graphics/Icons/NoPeopleFoundIcon';

export default function SearchScreen() {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  // const initialAnimationPosiition = windowWidth * 0.82;
  const FAKE_DATA = {
    fake_users: ['a', 'b', 'd', 'e', 'f'],
    fake_suggestedFriends: ['g', 'h', 'i', 'j', 'k', 'm', 'n', 'l', 'o', 'p'],
  };
  const [searchResult, setSearchResult] = useState([]);
  const [] = useState(0);
  const [] = useState(false);
  const [] = useState({
    page: 1,
    pagesCount: 2,
    totalCount: 0,
  });
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const [hasNoResults, setHasNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [mutualFriendsList, setMutualFriendsList] = useState([]);
  const [paginatedMutualFriendsList, setPaginatedMutualFriendsList] = useState(
    [],
  );
  const [suggestedList, setSuggestedList] = useState([]);
  const [loadingInitalFriendsList, setLoadingInitialFriendsList] = useState(
    true,
  );
  const [page, setPage] = useState(0);
  const [displayItemPage, setDisplayItemPage] = useState(1);
  // -----------------------------------------------------------------
  const changeHandler = new Subject();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const InputRef = useRef(null);
  //const shiftValue = useRef(new Animated.Value(initialAnimationPosiition))
  // .current;
  const shrinkValue = useRef(new Animated.Value(0.95)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const inputValueRef = useRef(inputValue);
  inputValueRef.current = inputValue;

  useEffect(() => {
    toggleMountedStatus();
    getSuggestedFriendsList();
  }, []);

  useEffect(() => {
    paginationHanlder();
  }, [mutualFriendsList, displayItemPage]);

  /**
   * Get a list of all mmutual friends and suggested friends
   * @method getSuggestedFriendsList
   */
  async function getSuggestedFriendsList() {
    SearchManager.getSuggestedFriendsList(page).then((res) => {
      if (res.success) {
        const newMutualFriendsList = [...mutualFriendsList, ...res.users];
        setMutualFriendsList(newMutualFriendsList);
        setSuggestedList(res.friend_suggestions);
        setPage(page + 1);
        const isOnFirstPage = page === 0 && res.users?.length > 5;
        if (res.users?.length < 10 && !isOnFirstPage) {
          setShowMore(false);
        } else {
          setShowMore(true);
        }
      }
      setLoadingInitialFriendsList(false);
      setLoading(false);
    });
  }

  /**
   * Create a paginated list for mutual friends
   * @method paginationHanlder
   */
  function paginationHanlder() {
    const initialDisplaySize = 5;
    const displayedItem = 10 * displayItemPage;
    if (displayItemPage === 1) {
      setPaginatedMutualFriendsList(
        mutualFriendsList.slice(0, initialDisplaySize),
      );
      return;
    }
    setPaginatedMutualFriendsList(mutualFriendsList.slice(0, displayedItem));
  }

  /**
   * Display more mutual friends when clicking on the ShowMore button
   * @method showMoreMutualFriends
   */
  function showMoreMutualFriends() {
    setDisplayItemPage(displayItemPage + 1);
    getSuggestedFriendsList();
  }

  /**
   * Animate the search input box
   * @method toggleSearchBox
   */
  function toggleSearchBox() {
    // Animated.parallel([
    //   Animated.spring(shiftValue, {
    //     toValue: 0,
    //     useNativeDriver: true,
    //   }),
    //   Animated.spring(opacityValue, {
    //     toValue: 1,
    //     useNativeDriver: true,
    //   }),
    // ]).start();
  }

  /**
   * Perform action when mounting the screen
   * @method toggleMountedStatus
   */
  function toggleMountedStatus() {
    setMounted(true);
    //toggleSearchBox();
    resetSearch();
    goBack();
  }

  /**
   * Display noResults illustration or not
   * @method toggleHasNoResultsComponent
   * @param {userList} - Result list of search
   */
  function toggleHasNoResultsComponent(userList: Array<Object>) {
    if (userList?.length === 0) {
      setHasNoResults(true);
    } else {
      setHasNoResults(false);
    }
  }

  /**
   * Clears the search result, clear the textInput both visually and programatically
   * * @method resetSearch
   */
  function resetSearch() {
    setSearchResult([]);
    InputRef.current?.clear();
    InputRef.current?.blur();
    setInputValue('');
    setHasNoResults(false);
  }

  /**
   * Clear the textInput field and reset search list to mutual friends and suggested friends list
   * @method clearTextInput
   */
  function clearTextInput() {
    resetSearch();
    setLoading(true);
    getSuggestedFriendsList();
  }

  function goBack() {
    if (inputValueRef.current?.length === 0 && mounted) {
      navigation.goBack();
    }
  }

  function updateTextInput(text: string) {
    setInputValue(text);
  }

  /**
   * Http Obseravle factory
   * @method createHttpObservable
   * @param {AxiosRequestObject} configuration - The Axios request object
   * @return {Observable} The http Stream
   */
  function createHttpObservable(user, configuration) {
    setLoading(true);
    return new Observable((observer) => {
      SearchManager.getSearchResults(user, configuration).then(
        (res) => {
          setLoading(false);
          observer.next({ ...res.data, url: res.config.url });
        },
        (err) => observer.error(err),
      );

      return () => {
        setLoading(false);
        source.cancel('request with ' + JSON.stringify(configuration));
      };
    });
  }

  /**
   * Creates http Observable
   * @method fetchMatches
   * @param {string} user - search criteria
   * @return {Observable} - http Observable
   */
  function fetchMatches(user = '') {
    const url = `/user-search?query=${user}`;
    const configuration = {
      method: 'GET',
      url,
      cancelToken: source.token,
    };
    return createHttpObservable(user, configuration);
  }

  /**
   * The next function of the Observable receives the next emitted value
   * @method nextHandler
   * @param {object} users - the axios response object
   */
  function nextHandler(users) {
    const textInput = users.url.split('/user-search?query=')[1];
    if (textInput?.length > 0) {
      setSearchResult(users.users);
    } else {
      setSearchResult([]);
    }
    toggleHasNoResultsComponent(users.users);
  }

  /**
   * handles the error case of the Observable
   * @method errorHandler
   * @param {object} err - the error object
   */
  function errorHandler(err) {
    Bugtracker.captureException(err, { scope: 'SearchScreen' });
  }

  /**
   * called when the Observable completes
   * @method onComplete
   */
  function onComplete() {}

  function applyChangeHanlder() {
    changeHandler
      .asObservable()
      .pipe(
        map((event) => event.nativeEvent.text),
        debounceTime(500),
        switchMap((user) => fetchMatches(user)),
      )
      .subscribe(nextHandler, errorHandler, onComplete);
  }
  applyChangeHanlder();

  const renderSearchBox = useMemo(() => {
    function animateSearchBarWidth() {
      if (inputValueRef.current?.length === 0) {
        Animated.spring(shrinkValue, {
          toValue: 0.95,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(shrinkValue, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
      }
    }
    animateSearchBarWidth();
    const widthStyle = {
      flex: shrinkValue,
    };
    return (
      <View style={styles.searchBar}>
        <Animated.View style={[styles.searchBarContainer, widthStyle]}>
          <SearchIcon />
          <TextInput
            ref={InputRef}
            style={styles.textInput}
            placeholder={'Search people'}
            placeholderTextColor={Globals.color.text.grey}
            onChange={(evt) => changeHandler.next(evt)}
            returnKeyType={'done'}
            autoCorrect={false}
            onChangeText={updateTextInput}
          />
          {loading ? (
            <View style={styles.loadingIndicatorContainer}>
              <ActivityIndicator />
            </View>
          ) : inputValueRef.current?.length > 0 ? (
            <HapticFeedBackWrapper onPress={clearTextInput}>
              <View style={styles.closeIconConatainer}>
                <CloseIcon size={8} />
              </View>
            </HapticFeedBackWrapper>
          ) : null}
        </Animated.View>
        {inputValueRef.current?.length === 0 ? (
          <View style={styles.closeIconWrapper}>
            <TouchableWithoutFeedback onPress={toggleMountedStatus}>
              <View style={styles.closeIconContainer}>
                <CloseIcon color={Globals.color.text.default} size={12} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : null}
      </View>
    );
  }, [loading, mounted]);

  function renderLoadingListItem() {
    return <UserListItem item={{}} loading />;
  }

  function renderLoadingList(fakeData: Array<string>, title: string) {
    return (
      <FlatList
        key={'placeholderList' + title}
        data={fakeData}
        renderItem={renderLoadingListItem}
        keyExtractor={(item) => item}
        listKey={(item) => item}
        ListHeaderComponent={renderListHeaderComponent(title)}
      />
    );
  }

  function renderListHeaderComponent(title: string) {
    return !loading ? (
      <View style={styles.emptyListHeaderContainer}>
        <Text style={styles.emptyListHeaderTitle}>{title}</Text>
      </View>
    ) : null;
  }

  function renderShowMoreButton() {
    return (
      <HapticFeedBackWrapper onPress={showMoreMutualFriends}>
        <View style={styles.showMoreContainer}>
          <Text style={styles.showMore}>Show more people</Text>
          <TinyArrow style={styles.arrowIcon} />
        </View>
      </HapticFeedBackWrapper>
    );
  }

  function renderListEmptyFooterComponent() {
    const title = 'Suggested For You';
    function compileSuggestedFriendlistStyle() {
      let flatlistStyle = styles.suggestedFriendsListContainer;
      if (paginatedMutualFriendsList?.length === 0) {
        flatlistStyle = {
          ...flatlistStyle,
          marginTop: 0,
        };
      }
      return flatlistStyle;
    }
    return (
      <View style={styles.listEmptyFooterComponent}>
        {showMore ? renderShowMoreButton() : null}
        {!loadingInitalFriendsList ? (
          <FlatList
            key={'SuggestedFriendsList'}
            data={suggestedList}
            renderItem={renderSearchedItem}
            listKey={(item) => item?.internal_id?.toString()}
            keyExtractor={(item) => item?.internal_id?.toString()}
            ListHeaderComponent={renderListHeaderComponent(title)}
            style={compileSuggestedFriendlistStyle()}
          />
        ) : null}
      </View>
    );
  }

  const renderListEmptyComponent = useMemo(() => {
    const title1 = 'You Might Know';
    const title2 = 'Suggested For You';

    return hasNoResults ? (
      <View style={styles.listEmptyComponent}>
        <IllustrationExplainer
          image={<NoPeopleFoundIcon />}
          headline={'No Results'}
          description={'Please try another search.'}
        />
      </View>
    ) : !loadingInitalFriendsList ? (
      <FlatList
        key={'MutualFriendsList'}
        data={paginatedMutualFriendsList}
        renderItem={renderSearchedItem}
        listKey={(item) => item.user.internal_id.toString()}
        keyExtractor={(item) => item.user.internal_id.toString()}
        ListHeaderComponent={
          paginatedMutualFriendsList.length > 0
            ? renderListHeaderComponent(title1)
            : null
        }
        ListFooterComponent={renderListEmptyFooterComponent()}
      />
    ) : (
      <View>
        {renderLoadingList(FAKE_DATA.fake_users, title1)}
        {renderLoadingList(FAKE_DATA.fake_suggestedFriends, title2)}
      </View>
    );
  }, [
    hasNoResults,
    paginatedMutualFriendsList,
    suggestedList,
    loadingInitalFriendsList,
    renderListEmptyFooterComponent,
  ]);

  function renderSearchedItem({ item }) {
    return (
      <UserListItem
        item={item}
        nestedObject={item.user !== undefined}
        mutualFriends={item?.mutual_friends_count}
        loading={loading}
      />
    );
  }

  const renderSearchList = useMemo(() => {
    function getSearchData() {
      if (searchResult?.length === 0) return [];
      return searchResult;
    }
    return (
      <FlatList
        key={'SearchUser'}
        data={getSearchData()}
        renderItem={renderSearchedItem}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={renderListEmptyComponent}
        keyExtractor={(item) => item.user.internal_id.toString()}
        listKey={(item) => item.user.internal_id.toString()}
      />
    );
  }, [searchResult, renderListEmptyComponent, mounted]);

  return (
    <SafeAreaView style={styles.container}>
      {renderSearchBox}
      {renderSearchList}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Globals.color.background.light },
  searchBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  searchBarContainer: {
    flexDirection: 'row',
    height: 40,
    flex: 1,
    alignSelf: 'center',
    backgroundColor: Globals.color.background.mediumgrey,
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.mini,
    borderRadius: Globals.dimension.borderRadius.large,
  },
  flatListContainer: {
    paddingTop: Globals.dimension.padding.small,
    paddingBottom: Globals.dimension.padding.large,
  },
  textInput: {
    flex: 1,
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    marginLeft: Globals.dimension.margin.tiny,
  },
  cancelWrapper: {
    marginLeft: Globals.dimension.margin.mini,
  },
  cancelText: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
  },
  closeIconConatainer: {
    width: 20,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Globals.color.text.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listEmptyComponent: {
    width: '100%',
    paddingTop: Globals.dimension.padding.mini,
  },
  listEmptyFooterComponent: {
    width: '100%',
  },
  suggestedFriendsListContainer: {
    marginTop: Globals.dimension.margin.small,
  },
  noResults: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
  },
  noPeopleFoundIcon: {
    width: 160,
    height: 160,
  },
  loadingIndicatorContainer: {
    marginRight: 3,
  },
  emptyListHeaderContainer: {
    width: '100%',
    paddingHorizontal: Globals.dimension.padding.small,
    marginBottom: Globals.dimension.margin.mini,
  },
  emptyListHeaderTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
  },
  showMoreContainer: {
    height: 40,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: Globals.color.background.light,
    paddingHorizontal: Globals.dimension.padding.mini,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Globals.dimension.borderRadius.large,
    elevation: Globals.shadows.shading1.elevation,
    shadowOffset: Globals.shadows.shading1.shadowOffset,
    shadowRadius: Globals.shadows.shading1.shadowRadius,
    shadowOpacity: Globals.shadows.shading1.shadowOpacity,
  },
  showMore: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
  },
  arrowIcon: {
    marginLeft: Globals.dimension.margin.tiny * 0.5,
  },
  closeIconWrapper: {
    flex: 0.13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconContainer: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Globals.color.background.mediumgrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
