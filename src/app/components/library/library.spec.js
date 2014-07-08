describe('Library', function() {
  beforeEach(function(){
    module('dmeApp');
    module('dmeApp.library');
  });

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('LibraryController', {
      $scope: scope,
    });
  }));

  it('should have a LibraryController defined', function() {
    expect(ctrl).toBeDefined();
  });

  it('should populate the correct number of category terms', inject(function(categoryTaxonomy) {
    expect(scope.params['categories']).toBeDefined();
    expect(scope.params['categories'].length).toEqual(categoryTaxonomy.length);
  }));

  it('should populate the correct number of version terms', inject(function(versionTaxonomy) {
    expect(scope.params['versions']).toBeDefined();
    expect(scope.params['versions'].length).toEqual(versionTaxonomy.length);
  }));

  it('should have a selectedTerms filter', inject(function($filter) {
    expect($filter('selectedTerms')).not.toEqual(null);
  }));

  it('should correctly filter selected category terms with the selectedTerms filter', inject(function(selectedTermsFilter, categoryTaxonomy) {
    tids = Object.keys(categoryTaxonomy);
    tid = tids[Math.floor(Math.random() * tids.length)];
    scope.params['categories'][tid].selected = true;
    expect(selectedTermsFilter(scope.params['categories']).length).toEqual(1);
  }));

  it('should correctly filter selected version terms with the selectedTerms filter', inject(function(selectedTermsFilter, versionTaxonomy) {
    tids = Object.keys(versionTaxonomy);
    tid = tids[Math.floor(Math.random() * tids.length)];
    scope.params['versions'][tid].selected = true;
    expect(selectedTermsFilter(scope.params['versions']).length).toEqual(1);
  }));

  it('should reset any selected category terms', inject(function(categoryTaxonomy) {
    tids = Object.keys(categoryTaxonomy);
    tid = tids[Math.floor(Math.random() * tids.length)];
    scope.params['categories'][tid].selected = true;
    scope.resetTerms(scope.params['categories']);
    expect(scope.params['categories'][tid].selected).toBe(false);
  }));

  it('should reset any selected version terms', inject(function(versionTaxonomy) {
    tids = Object.keys(versionTaxonomy);
    tid = tids[Math.floor(Math.random() * tids.length)];
    scope.params['versions'][tid].selected = true;
    scope.resetTerms(scope.params['versions']);
    expect(scope.params['versions'][tid].selected).toBe(false);
  }));
});