import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

export function UATReview() {
  const [formData, setFormData] = useState({
    projectName: '',
    testingPhase: '',
    tester: '',
    testDate: '',
    environment: '',
    
    // Modules Tested
    dashboard: false,
    nbos: false,
    products: false,
    masterData: false,
    opportunities: false,
    search: false,
    analytics: false,
    
    // Test Results
    functionalityStatus: '',
    performanceStatus: '',
    usabilityStatus: '',
    dataIntegrityStatus: '',
    
    // Issues
    criticalIssues: '',
    majorIssues: '',
    minorIssues: '',
    
    // Comments
    positiveFindings: '',
    improvements: '',
    additionalComments: '',
    
    // Sign-off
    approverName: '',
    approverTitle: '',
    approvalDate: '',
    approvalStatus: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectName || !formData.tester || !formData.testDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('UAT Review submitted successfully');
  };

  const handleReset = () => {
    setFormData({
      projectName: '',
      testingPhase: '',
      tester: '',
      testDate: '',
      environment: '',
      dashboard: false,
      nbos: false,
      products: false,
      masterData: false,
      opportunities: false,
      search: false,
      analytics: false,
      functionalityStatus: '',
      performanceStatus: '',
      usabilityStatus: '',
      dataIntegrityStatus: '',
      criticalIssues: '',
      majorIssues: '',
      minorIssues: '',
      positiveFindings: '',
      improvements: '',
      additionalComments: '',
      approverName: '',
      approverTitle: '',
      approvalDate: '',
      approvalStatus: '',
    });
    toast.info('Form reset');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>UAT & Review - Final Production Form</h1>
        <p className="text-gray-600">Complete this form after User Acceptance Testing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Project Name *</Label>
                <Input
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label>Testing Phase</Label>
                <Select value={formData.testingPhase} onValueChange={(value) => setFormData({ ...formData, testingPhase: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alpha">Alpha</SelectItem>
                    <SelectItem value="Beta">Beta</SelectItem>
                    <SelectItem value="UAT">UAT</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tester Name *</Label>
                <Input
                  value={formData.tester}
                  onChange={(e) => setFormData({ ...formData, tester: e.target.value })}
                  placeholder="Enter tester name"
                />
              </div>
              <div>
                <Label>Test Date *</Label>
                <Input
                  type="date"
                  value={formData.testDate}
                  onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Environment</Label>
                <Select value={formData.environment} onValueChange={(value) => setFormData({ ...formData, environment: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Staging">Staging</SelectItem>
                    <SelectItem value="Pre-Production">Pre-Production</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules Tested */}
        <Card>
          <CardHeader>
            <CardTitle>Modules Tested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dashboard"
                  checked={formData.dashboard}
                  onCheckedChange={(checked) => setFormData({ ...formData, dashboard: checked as boolean })}
                />
                <label htmlFor="dashboard" className="text-sm cursor-pointer">
                  Dashboard
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nbos"
                  checked={formData.nbos}
                  onCheckedChange={(checked) => setFormData({ ...formData, nbos: checked as boolean })}
                />
                <label htmlFor="nbos" className="text-sm cursor-pointer">
                  NBOs
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="products"
                  checked={formData.products}
                  onCheckedChange={(checked) => setFormData({ ...formData, products: checked as boolean })}
                />
                <label htmlFor="products" className="text-sm cursor-pointer">
                  Products
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="masterData"
                  checked={formData.masterData}
                  onCheckedChange={(checked) => setFormData({ ...formData, masterData: checked as boolean })}
                />
                <label htmlFor="masterData" className="text-sm cursor-pointer">
                  Master Data
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="opportunities"
                  checked={formData.opportunities}
                  onCheckedChange={(checked) => setFormData({ ...formData, opportunities: checked as boolean })}
                />
                <label htmlFor="opportunities" className="text-sm cursor-pointer">
                  Opportunities
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="search"
                  checked={formData.search}
                  onCheckedChange={(checked) => setFormData({ ...formData, search: checked as boolean })}
                />
                <label htmlFor="search" className="text-sm cursor-pointer">
                  Search
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analytics"
                  checked={formData.analytics}
                  onCheckedChange={(checked) => setFormData({ ...formData, analytics: checked as boolean })}
                />
                <label htmlFor="analytics" className="text-sm cursor-pointer">
                  Analytics
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Functionality Status</Label>
                <Select value={formData.functionalityStatus} onValueChange={(value) => setFormData({ ...formData, functionalityStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Pass with Issues">Pass with Issues</SelectItem>
                    <SelectItem value="Fail">Fail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Performance Status</Label>
                <Select value={formData.performanceStatus} onValueChange={(value) => setFormData({ ...formData, performanceStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Pass with Issues">Pass with Issues</SelectItem>
                    <SelectItem value="Fail">Fail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Usability Status</Label>
                <Select value={formData.usabilityStatus} onValueChange={(value) => setFormData({ ...formData, usabilityStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Pass with Issues">Pass with Issues</SelectItem>
                    <SelectItem value="Fail">Fail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Data Integrity Status</Label>
                <Select value={formData.dataIntegrityStatus} onValueChange={(value) => setFormData({ ...formData, dataIntegrityStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Pass with Issues">Pass with Issues</SelectItem>
                    <SelectItem value="Fail">Fail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues Found */}
        <Card>
          <CardHeader>
            <CardTitle>Issues Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Critical Issues</Label>
              <Textarea
                value={formData.criticalIssues}
                onChange={(e) => setFormData({ ...formData, criticalIssues: e.target.value })}
                placeholder="List any critical issues that block functionality"
                rows={3}
              />
            </div>
            <div>
              <Label>Major Issues</Label>
              <Textarea
                value={formData.majorIssues}
                onChange={(e) => setFormData({ ...formData, majorIssues: e.target.value })}
                placeholder="List major issues that impact user experience"
                rows={3}
              />
            </div>
            <div>
              <Label>Minor Issues</Label>
              <Textarea
                value={formData.minorIssues}
                onChange={(e) => setFormData({ ...formData, minorIssues: e.target.value })}
                placeholder="List minor issues or cosmetic defects"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Comments */}
        <Card>
          <CardHeader>
            <CardTitle>User Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Positive Findings</Label>
              <Textarea
                value={formData.positiveFindings}
                onChange={(e) => setFormData({ ...formData, positiveFindings: e.target.value })}
                placeholder="What worked well during testing?"
                rows={3}
              />
            </div>
            <div>
              <Label>Suggested Improvements</Label>
              <Textarea
                value={formData.improvements}
                onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                placeholder="What could be improved?"
                rows={3}
              />
            </div>
            <div>
              <Label>Additional Comments</Label>
              <Textarea
                value={formData.additionalComments}
                onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
                placeholder="Any other feedback or observations"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Approver Sign-off */}
        <Card>
          <CardHeader>
            <CardTitle>Approver Sign-off</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Approver Name</Label>
                <Input
                  value={formData.approverName}
                  onChange={(e) => setFormData({ ...formData, approverName: e.target.value })}
                  placeholder="Enter approver name"
                />
              </div>
              <div>
                <Label>Approver Title</Label>
                <Input
                  value={formData.approverTitle}
                  onChange={(e) => setFormData({ ...formData, approverTitle: e.target.value })}
                  placeholder="Enter job title"
                />
              </div>
              <div>
                <Label>Approval Date</Label>
                <Input
                  type="date"
                  value={formData.approvalDate}
                  onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Approval Status</Label>
                <Select value={formData.approvalStatus} onValueChange={(value) => setFormData({ ...formData, approvalStatus: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Approved with Conditions">Approved with Conditions</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Pending Review">Pending Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset Form
          </Button>
          <Button type="submit">
            Submit UAT Review
          </Button>
        </div>
      </form>
    </div>
  );
}
